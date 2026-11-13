/* The Stage in 3D: two anonymous, stylized dancers (a lead in black, a follow in a lime dress)
   dancing one bar of salsa under stage lights.

   Nothing here is a recording of a real person. The figures are built from simple shapes and
   posed with inverse kinematics; the choreography is written as code in `choreo()` below:
     counts 1-2-3  basic step in closed hold
     count  4      pause
     counts 5-6-7  he lifts her hand, she sinks low and spins on the floor while he turns her
     count  8      pause in the final picture
   `u` is the musical position in counts (0 = start of count 1, 8 = end of count 8). */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { token } from './theme';

const { lerp, clamp } = MathUtils;
const UP = new Vector3(0, 1, 0);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);

/* ------------------------------------------------------------------ figure */

type Dims = {
  hip: number; // standing pelvis height
  thigh: number;
  shin: number;
  torso: number;
  neck: number;
  head: number;
  shoulder: number; // half shoulder width
  hipHalf: number;
  upper: number;
  fore: number;
  ankle: number; // ankle height when the foot is flat
};

type Pose = {
  pelvis: Vector3;
  yaw: number; // 0 = facing the audience (+z)
  lean: number; // forward lean of the spine
  side: number; // lean to the dancer's left
  twist: number; // chest turn relative to the hips
  footL: Vector3;
  footR: Vector3;
  pointL: number; // 0 = flat foot, 1 = pointed toe
  pointR: number;
  handL: Vector3;
  handR: Vector3;
  headTurn: number;
};

const newPose = (): Pose => ({
  pelvis: v3(),
  yaw: 0,
  lean: 0,
  side: 0,
  twist: 0,
  footL: v3(),
  footR: v3(),
  pointL: 0,
  pointR: 0,
  handL: v3(),
  handR: v3(),
  headTurn: 0,
});

const tmpA = v3();
const tmpB = v3();
const tmpC = v3();
const basis = new Matrix4();

/** A tapered limb from point a to point b. */
function limb(rStart: number, rEnd: number, mat: MeshStandardMaterial) {
  const g = new CylinderGeometry(rEnd, rStart, 1, 14, 1);
  g.translate(0, 0.5, 0);
  const m = new Mesh(g, mat);
  m.castShadow = true;
  return m;
}
function place(mesh: Mesh, a: Vector3, b: Vector3) {
  mesh.position.copy(a);
  tmpA.subVectors(b, a);
  const len = Math.max(tmpA.length(), 1e-4);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(UP, tmpA.divideScalar(len));
}
function ball(r: number, mat: MeshStandardMaterial) {
  const m = new Mesh(new SphereGeometry(r, 18, 14), mat);
  m.castShadow = true;
  return m;
}

/** Two-bone inverse kinematics. Writes the middle joint and the reachable end point. */
function ik(root: Vector3, target: Vector3, l1: number, l2: number, pole: Vector3, mid: Vector3, end: Vector3) {
  tmpA.subVectors(target, root);
  const d = clamp(tmpA.length(), Math.abs(l1 - l2) + 0.01, (l1 + l2) * 0.998);
  tmpA.normalize();
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  tmpB.copy(pole).addScaledVector(tmpA, -pole.dot(tmpA));
  if (tmpB.lengthSq() < 1e-6) tmpB.set(0, 0, 1);
  tmpB.normalize();
  mid.copy(root).addScaledVector(tmpA, a).addScaledVector(tmpB, h);
  end.copy(root).addScaledVector(tmpA, d);
}

type Look = {
  skin: MeshStandardMaterial;
  top: MeshStandardMaterial;
  sleeve: MeshStandardMaterial;
  leg: MeshStandardMaterial;
  shoe: MeshStandardMaterial;
  hair: MeshStandardMaterial;
  dress?: MeshStandardMaterial;
};

class Dancer {
  group = new Group();
  pose = newPose();
  // joints, in world space
  chest = v3();
  headC = v3();
  shL = v3();
  shR = v3();
  hipL = v3();
  hipR = v3();
  fwd = v3();
  left = v3();
  spine = v3();
  private elL = v3();
  private elR = v3();
  private wrL = v3();
  private wrR = v3();
  private knL = v3();
  private knR = v3();
  private anL = v3();
  private anR = v3();
  private leftC = v3();

  private torso: Mesh;
  private hips: Mesh;
  private neck: Mesh;
  private head: Mesh;
  private hair: Mesh;
  private parts: Record<string, Mesh> = {};
  private skirt?: { mesh: Mesh; pos: Float32Array; rings: number; segs: number };
  private tail: Mesh[] = [];
  private tailTip = v3();
  private lastYaw = 0;
  private omega = 0;

  constructor(
    private d: Dims,
    look: Look,
    private female: boolean,
  ) {
    // torso: a lathe profile (hips, waist, chest, shoulders), flattened front to back
    const prof = female
      ? [
          [0.118, 0],
          [0.128, 0.1],
          [0.098, 0.36],
          [0.128, 0.7],
          [0.122, 0.88],
          [0.05, 0.99],
          [0.0, 1],
        ]
      : [
          [0.125, 0],
          [0.132, 0.12],
          [0.128, 0.4],
          [0.172, 0.76],
          [0.17, 0.9],
          [0.06, 0.99],
          [0.0, 1],
        ];
    const lathe = new LatheGeometry(
      prof.map(([r, y]) => new Vector2(r, y)),
      24,
    );
    // the dress is strapless: paint the top of her torso in skin colour
    const colors = new Float32Array(lathe.attributes.position.count * 3);
    const cTop = (look.dress ?? look.top).color;
    for (let i = 0; i < lathe.attributes.position.count; i++) {
      const y = lathe.attributes.position.getY(i);
      const c = female && y > 0.87 ? look.skin.color : cTop;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    lathe.setAttribute('color', new BufferAttribute(colors, 3));
    const torsoMat = (look.dress ?? look.top).clone();
    torsoMat.vertexColors = true;
    torsoMat.color.set('#ffffff');
    this.torso = new Mesh(lathe, torsoMat);
    this.torso.castShadow = true;

    this.hips = ball(1, female ? (look.dress ?? look.top) : look.leg);
    this.neck = limb(0.042, 0.038, look.skin);
    this.head = ball(d.head, look.skin);
    this.head.scale.set(0.92, 1.12, 1);
    // hair: a cap sitting on the back and top of the head, no face
    this.hair = ball(d.head * 1.06, look.hair);
    this.hair.scale.set(0.95, 1.08, 1);

    const add = (name: string, mesh: Mesh) => (this.parts[name] = mesh);
    for (const s of ['L', 'R']) {
      add('sh' + s, ball(female ? 0.047 : 0.062, female ? look.skin : look.sleeve));
      add('up' + s, limb(female ? 0.043 : 0.055, female ? 0.036 : 0.045, look.sleeve));
      add('el' + s, ball(female ? 0.036 : 0.045, look.sleeve));
      add('fo' + s, limb(female ? 0.035 : 0.044, female ? 0.026 : 0.034, look.sleeve));
      add('ha' + s, ball(female ? 0.034 : 0.042, look.skin));
      add('th' + s, limb(female ? 0.074 : 0.082, female ? 0.05 : 0.058, look.leg));
      add('kn' + s, ball(female ? 0.05 : 0.058, look.leg));
      add('shn' + s, limb(female ? 0.049 : 0.057, female ? 0.03 : 0.04, look.leg));
      const foot = ball(1, look.shoe);
      add('ft' + s, foot);
    }

    this.group.add(this.torso, this.hips, this.neck, this.head, this.hair, ...Object.values(this.parts));

    if (female && look.dress) {
      const rings = 8;
      const segs = 36;
      const pos = new Float32Array(rings * (segs + 1) * 3);
      const idx: number[] = [];
      for (let j = 0; j < rings - 1; j++)
        for (let s = 0; s < segs; s++) {
          const a = j * (segs + 1) + s;
          const b = a + segs + 1;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      g.setIndex(idx);
      const mat = look.dress.clone();
      mat.side = DoubleSide;
      const mesh = new Mesh(g, mat);
      mesh.castShadow = true;
      mesh.frustumCulled = false;
      this.skirt = { mesh, pos, rings, segs };
      this.group.add(mesh);

      // ponytail: a short chain that swings out when she spins
      for (let i = 0; i < 10; i++) {
        const b = ball(0.043 - i * 0.0027, look.hair);
        this.tail.push(b);
        this.group.add(b);
      }
    }
  }

  /** Step 1: place the torso. After this the shoulders, hips and head are known. */
  body() {
    const p = this.pose;
    const cy = Math.cos(p.yaw);
    const sy = Math.sin(p.yaw);
    this.fwd.set(sy, 0, cy);
    this.left.set(cy, 0, -sy);
    this.spine.copy(UP).addScaledVector(this.fwd, Math.tan(p.lean)).addScaledVector(this.left, Math.tan(p.side)).normalize();
    this.chest.copy(p.pelvis).addScaledVector(this.spine, this.d.torso);
    const ty = p.yaw + p.twist;
    this.leftC.set(Math.cos(ty), 0, -Math.sin(ty));
    this.shL.copy(this.chest).addScaledVector(this.leftC, this.d.shoulder).addScaledVector(this.spine, -0.05);
    this.shR.copy(this.chest).addScaledVector(this.leftC, -this.d.shoulder).addScaledVector(this.spine, -0.05);
    this.hipL.copy(p.pelvis).addScaledVector(this.left, this.d.hipHalf).addScaledVector(UP, -0.03);
    this.hipR.copy(p.pelvis).addScaledVector(this.left, -this.d.hipHalf).addScaledVector(UP, -0.03);
    this.headC.copy(this.chest).addScaledVector(this.spine, this.d.neck + this.d.head * 0.95);
  }

  /** Step 2: solve arms and legs for the hand and foot targets, then move every mesh. */
  finish(dt: number, time: number) {
    const p = this.pose;
    const d = this.d;

    // arms: elbows fall down and slightly back/out
    tmpC.copy(UP).multiplyScalar(-1).addScaledVector(this.fwd, -0.55).addScaledVector(this.leftC, 0.45);
    ik(this.shL, p.handL, d.upper, d.fore, tmpC, this.elL, this.wrL);
    tmpC.copy(UP).multiplyScalar(-1).addScaledVector(this.fwd, -0.55).addScaledVector(this.leftC, -0.45);
    ik(this.shR, p.handR, d.upper, d.fore, tmpC, this.elR, this.wrR);
    // legs: knees go forward and a little outward
    tmpC.copy(this.fwd).addScaledVector(this.left, 0.3).addScaledVector(UP, 0.2);
    ik(this.hipL, p.footL, d.thigh, d.shin, tmpC, this.knL, this.anL);
    tmpC.copy(this.fwd).addScaledVector(this.left, -0.3).addScaledVector(UP, 0.2);
    ik(this.hipR, p.footR, d.thigh, d.shin, tmpC, this.knR, this.anR);

    // torso
    tmpA.crossVectors(this.leftC, this.spine).normalize(); // forward of the chest
    tmpB.crossVectors(this.spine, tmpA).normalize(); // left, made square to the spine
    basis.makeBasis(tmpB, this.spine, tmpA);
    this.torso.quaternion.setFromRotationMatrix(basis);
    this.torso.position.copy(p.pelvis).addScaledVector(this.spine, -0.07);
    this.torso.scale.set(this.female ? 1.18 : 1.22, d.torso + 0.07, this.female ? 0.74 : 0.72);
    this.hips.position.copy(p.pelvis).addScaledVector(UP, -0.02);
    this.hips.quaternion.setFromAxisAngle(UP, p.yaw);
    this.hips.scale.set(d.hipHalf * 1.62, 0.105, 0.108);

    // neck, head, hair
    tmpA.copy(this.chest).addScaledVector(this.spine, -0.03);
    tmpB.copy(this.chest).addScaledVector(this.spine, d.neck + 0.02);
    place(this.neck, tmpA, tmpB);
    this.head.position.copy(this.headC);
    this.head.quaternion.setFromRotationMatrix(basis);
    this.head.rotateY(p.headTurn);
    this.hair.position.copy(this.headC).addScaledVector(this.spine, d.head * 0.14);
    tmpA.set(0, 0, -1).applyQuaternion(this.head.quaternion); // back of the head
    this.hair.position.addScaledVector(tmpA, d.head * 0.2);
    this.hair.quaternion.copy(this.head.quaternion);

    const P = this.parts;
    const sides: [string, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, number][] = [
      ['L', this.shL, this.elL, this.wrL, this.hipL, this.knL, this.anL, p.pointL],
      ['R', this.shR, this.elR, this.wrR, this.hipR, this.knR, this.anR, p.pointR],
    ];
    for (const [s, sh, el, wr, hip, kn, an, point] of sides) {
      P['sh' + s].position.copy(sh);
      place(P['up' + s], sh, el);
      P['el' + s].position.copy(el);
      place(P['fo' + s], el, wr);
      P['ha' + s].position.copy(wr);
      place(P['th' + s], hip, kn);
      P['kn' + s].position.copy(kn);
      place(P['shn' + s], kn, an);
      // foot: flat on the floor facing forward, or pointed along the shin
      const foot = P['ft' + s];
      tmpA.subVectors(an, kn).normalize();
      tmpB.copy(this.fwd).lerp(tmpA, point).normalize();
      tmpC.crossVectors(UP, tmpB);
      if (tmpC.lengthSq() < 1e-5) tmpC.copy(this.left);
      tmpC.normalize();
      tmpA.crossVectors(tmpB, tmpC).normalize();
      basis.makeBasis(tmpC, tmpA, tmpB);
      foot.quaternion.setFromRotationMatrix(basis);
      foot.position.copy(an).addScaledVector(tmpB, this.female ? 0.07 : 0.08).addScaledVector(tmpA, -0.03 * (1 - point));
      foot.scale.set(this.female ? 0.036 : 0.047, this.female ? 0.03 : 0.036, this.female ? 0.105 : 0.128);
    }

    // how fast she is turning drives the skirt and the ponytail
    let dy = p.yaw - this.lastYaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    this.lastYaw = p.yaw;
    if (dt > 0) this.omega = lerp(this.omega, clamp(dy / dt, -14, 14), 0.18);
    else this.omega = 0;
    if (this.skirt) this.updateSkirt(time);
    if (this.tail.length) this.updateTail(dt);
  }

  private updateSkirt(time: number) {
    const { pos, rings, segs, mesh } = this.skirt!;
    const p = this.pose;
    const flare = clamp(Math.abs(this.omega) / 7, 0, 1);
    // when she is low on the floor the dress stays long and pools, so it always covers her legs
    const low = 1 - smooth(0.5, 0.8, p.pelvis.y);
    const len = 0.46 + 0.06 * low;
    // down on the floor the legs are fully under the dress, so they are not drawn (no poking through)
    const hideLegs = low > 0.55;
    for (const n of ['th', 'kn', 'shn', 'ft']) for (const sd of ['L', 'R']) this.parts[n + sd].visible = !hideLegs;
    const lag = clamp(this.omega * 0.085, -1.3, 1.3);
    const waist = tmpA.copy(p.pelvis).addScaledVector(this.spine, 0.1);
    let k = 0;
    for (let j = 0; j < rings; j++) {
      const t = j / (rings - 1);
      const drop = len * t * (1 - 0.42 * flare * (1 - low));
      const rBase = 0.108 + (0.235 + 0.42 * flare - 0.108) * Math.pow(t, 0.78);
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * Math.PI * 2;
        const ang = a + p.yaw - lag * t;
        const ruffle = 1 + 0.085 * t * Math.sin(a * 7 + t * 3 + time * 2.2) + 0.04 * t * Math.sin(a * 3 - time * 1.4);
        let r = rBase * ruffle;
        let y = waist.y - drop;
        // drape over the knees instead of letting them poke through the fabric
        for (const kn of [this.knL, this.knR]) {
          const kx = kn.x - waist.x;
          const kz = kn.z - waist.z;
          const reach = Math.hypot(kx, kz) + 0.06;
          if (reach <= r) continue;
          let da = ang - Math.atan2(kx, kz);
          da = Math.abs(Math.atan2(Math.sin(da), Math.cos(da)));
          const wgt = (1 - smooth(0.3, 0.95, da)) * (1 - smooth(0.02, 0.2, Math.abs(y - kn.y))) * (1 - low);
          r += (reach - r) * wgt;
        }
        const floor = 0.018 + 0.01 * Math.sin(a * 5);
        if (y < floor) {
          r += (floor - y) * 0.75; // the hem pools outward on the floor
          y = floor;
        }
        // flatten slightly front to back so it reads as a dress, not a cone
        pos[k++] = waist.x + Math.sin(ang) * r;
        pos[k++] = y;
        pos[k++] = waist.z + Math.cos(ang) * r;
      }
    }
    const g = mesh.geometry;
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }

  private updateTail(dt: number) {
    const d = this.d;
    const root = tmpA.set(0, 0.35, -1).applyQuaternion(this.head.quaternion).multiplyScalar(d.head * 1.05).add(this.headC);
    // rest: hangs down the back; spinning throws it outward
    const out = tmpB.set(0, 0, -1).applyQuaternion(this.head.quaternion);
    const swing = clamp(Math.abs(this.omega) / 8, 0, 1);
    const target = tmpC.copy(root).addScaledVector(UP, -0.3 * (1 - swing * 0.75)).addScaledVector(out, 0.1 + 0.3 * swing);
    // the tip trails behind the direction of the turn
    target.addScaledVector(this.left, -Math.sign(this.omega) * 0.14 * swing);
    if (dt <= 0 || this.tailTip.lengthSq() === 0) this.tailTip.copy(target);
    else this.tailTip.lerp(target, 1 - Math.pow(0.0015, dt));
    for (let i = 0; i < this.tail.length; i++) {
      const t = i / (this.tail.length - 1);
      this.tail[i].position.lerpVectors(root, this.tailTip, t);
      this.tail[i].position.y -= Math.sin(t * Math.PI) * 0.04;
    }
  }
}

/* ------------------------------------------------------------------ choreography */

const M: Dims = { hip: 1.0, thigh: 0.46, shin: 0.46, torso: 0.5, neck: 0.075, head: 0.105, shoulder: 0.205, hipHalf: 0.095, upper: 0.3, fore: 0.27, ankle: 0.075 };
const W: Dims = { hip: 0.965, thigh: 0.44, shin: 0.43, torso: 0.45, neck: 0.07, head: 0.097, shoulder: 0.165, hipHalf: 0.09, upper: 0.27, fore: 0.25, ankle: 0.09 };

const PIVOT = v3(0.1, 0, 0.14); // where she spins
const M_SPIN = v3(-0.42, 0, -0.26); // where he stands while he turns her (he walks round behind her)
const YAW_M = -1.22; // closed hold: he faces stage left (and a little to the audience)
const YAW_W = 1.22;
const YAW_M_SPIN = 0.92;
const YAW_W_FINAL = 0.42;

const t1 = v3();
const t2 = v3();
const t3 = v3();
const rot = (out: Vector3, x: number, y: number, z: number, yaw: number, origin: Vector3) => {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return out.set(origin.x + x * c + z * s, origin.y + y, origin.z - x * s + z * c);
};
const arc = (x: number) => Math.sin(Math.PI * clamp(x, 0, 1));

function choreo(u: number, time: number, spinTime: number, man: Dancer, woman: Dancer, still: boolean) {
  const m = man.pose;
  const w = woman.pose;

  // ---- drivers
  const c1 = smooth(0.05, 0.95, u);
  const c2 = smooth(1.05, 1.95, u);
  const c3 = smooth(2.05, 2.95, u);
  const open = smooth(3.2, 4.4, u); // closed hold -> he lifts her hand over her head
  const move = smooth(3.5, 4.7, u); // both walk to their places for the spin
  const down = smooth(4.2, 5.1, u); // she sinks to the floor
  const fin = smooth(7.0, 7.75, u); // the final picture
  const gate = smooth(4.3, 4.9, u);
  const breath = still ? 0 : Math.sin(time * 1.7);
  const beat = still ? 0 : Math.sin(time * 5.2) * (1 - down) * (1 - smooth(3, 3.3, u) * (1 - smooth(3.8, 4, u)));

  // ---- basic step (counts 1-3): he steps forward on his left, she steps back on her right
  const travel = -(0.13 * c1 - 0.11 * c2 - 0.02 * c3); // the couple travels towards stage left and back
  const stepFoot = -(0.27 * c1 - 0.27 * c3);
  const lift1 = arc((u - 0.05) / 0.9) + arc((u - 2.05) / 0.9);
  const sway = Math.sin(Math.PI * clamp(u, 0, 3)) * 0.045 * (1 - open);

  // ---- the lead
  const mYaw = lerp(YAW_M, YAW_M_SPIN, move);
  m.yaw = mYaw;
  m.pelvis.set(lerp(0.27 + travel, M_SPIN.x, move), M.hip - 0.015 - 0.035 * down + 0.02 * fin + beat * 0.006, lerp(0, M_SPIN.z, move) - 0.38 * arc(move));
  m.lean = 0.03 + 0.2 * down - 0.1 * fin + breath * 0.006;
  m.side = sway - 0.05 * down;
  m.twist = 0.12 * down - 0.1 * fin;
  m.headTurn = lerp(0, 0.35, down) - 0.2 * fin;
  m.pointL = 0;
  m.pointR = 0;
  // feet: home under the hips, then the stance for the spin
  const mlA = rot(t1, 0.09, 0, 0, YAW_M, t3.set(0.27, 0, 0));
  mlA.x += stepFoot;
  mlA.y = M.ankle + 0.05 * lift1;
  const mlB = rot(t2, 0.16, M.ankle, 0.12, YAW_M_SPIN, M_SPIN);
  m.footL.lerpVectors(mlA, mlB, move);
  m.footL.z -= 0.34 * arc(move);
  m.footL.y += 0.06 * arc(move * 1.5 - 0.5);
  const mrA = rot(t1, -0.09, M.ankle, 0, YAW_M, t3.set(0.27, 0, 0));
  const mrB = rot(t2, -0.15, M.ankle, -0.1, YAW_M_SPIN, M_SPIN);
  m.footR.lerpVectors(mrA, mrB, move);
  m.footR.z -= 0.34 * arc(move);
  m.footR.y += 0.06 * arc(move * 1.5);

  // ---- the follow
  // turning: two full turns driven by the scroll, plus a continuous spin while you stay on counts 5-7
  let wYaw = YAW_W + smooth(4.3, 7.15, u) * Math.PI * 4 + spinTime * gate;
  const settle = YAW_W_FINAL + Math.PI * 2 * Math.round((wYaw - YAW_W_FINAL) / (Math.PI * 2));
  wYaw = lerp(wYaw, settle, fin);
  w.yaw = wYaw;
  const lowH = 0.4;
  rot(t1, 0, 0, -0.07, wYaw, PIVOT); // low: she sits back over her supporting heel
  w.pelvis.set(lerp(-0.27 + travel, t1.x, move), lerp(W.hip - 0.015 + beat * 0.006, lowH + breath * 0.004, down), lerp(0, t1.z, move) + 0.1 * arc(move));
  w.lean = lerp(0.02, 0.3, down) - 0.06 * fin + breath * 0.006;
  w.side = lerp(-sway, -0.12, down);
  w.twist = 0.1 * down + 0.18 * fin;
  w.headTurn = 0.3 * fin;
  // feet
  const wrA = rot(t2, -0.085, 0, 0, YAW_W, t3.set(-0.27, 0, 0));
  wrA.x += stepFoot;
  wrA.y = W.ankle + 0.05 * lift1;
  const wrB = rot(t3, -0.02, 0.105, 0.03, wYaw, PIVOT); // supporting foot, on the ball
  w.footR.lerpVectors(wrA, wrB, move);
  w.footR.y += 0.04 * arc(move * 1.5);
  w.pointR = 0.55 * down;
  const wlA = rot(t2, 0.085, W.ankle, 0, YAW_W, t3.set(-0.27, 0, 0));
  const wlB = rot(t3, 0.5, 0.055, 0.14, wYaw, PIVOT); // the extended leg sweeps the floor, under the hem
  w.footL.lerpVectors(wlA, wlB, down);
  w.footL.y += 0.07 * arc(down);
  w.pointL = down;

  man.body();
  woman.body();

  // ---- hands
  // joined hands (his left, her right): out to the side in closed hold, then above her head
  t1.addVectors(man.shL, woman.shR).multiplyScalar(0.5);
  t1.z += 0.3;
  t1.y -= 0.03 - beat * 0.01;
  t2.copy(woman.headC);
  t2.y += W.head + 0.13 - 0.03 * down;
  // he stirs a small circle with her turn
  t2.x += Math.sin(wYaw) * 0.035 * gate * (1 - fin);
  t2.z += Math.cos(wYaw) * 0.035 * gate * (1 - fin);
  m.handL.lerpVectors(t1, t2, open);
  w.handR.copy(m.handL);

  // his right hand: on her shoulder blade, then out to the side, then up for the final picture
  t1.copy(woman.shL).addScaledVector(woman.fwd, -0.1).addScaledVector(UP, -0.1);
  t2.copy(man.pose.pelvis)
    .addScaledVector(man.left, -(0.42 + 0.1 * fin))
    .addScaledVector(UP, 0.22 + 0.62 * fin)
    .addScaledVector(man.fwd, -0.06);
  m.handR.lerpVectors(t1, t2, open);

  // her left hand: on his shoulder, then reaching out along the extended leg
  t1.copy(man.shR).addScaledVector(UP, 0.05).addScaledVector(man.fwd, 0.03);
  rot(t2, 0.47 + 0.05 * fin, 0.36 + 0.2 * fin, 0.2, wYaw, woman.pose.pelvis);
  rot(t3, 0.4, 0.33, 0.05, wYaw, woman.pose.pelvis);
  t2.lerpVectors(t3, t2, down);
  w.handL.lerpVectors(t1, t2, open);
}

/* ------------------------------------------------------------------ scene */

const coneVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying float vT;
  void main() {
    vT = 1.0 - uv.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const coneFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  varying vec3 vN;
  varying vec3 vV;
  varying float vT;
  void main() {
    float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
    float a = uPower * edge * (1.0 - 0.8 * vT) * smoothstep(0.0, 0.04, vT) * smoothstep(1.0, 0.8, vT);
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export type StageScene = { setCount: (u: number) => void; destroy: () => void };

export function initStageScene(canvas: HTMLCanvasElement): StageScene | null {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 900px)').matches;
  const lowPower = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 60);

  // ---- materials
  const std = (color: string, roughness: number, metalness = 0) => new MeshStandardMaterial({ color, roughness, metalness });
  const skin = std('#d9bfa6', 0.62);
  const black = std('#17171c', 0.42, 0.15);
  const lime = std('#9fe01f', 0.48);
  lime.emissive = new Color('#7fcf00');
  lime.emissiveIntensity = 0.28;
  const man = new Dancer(M, { skin, top: black, sleeve: black, leg: black, shoe: std('#08080a', 0.18, 0.3), hair: std('#1b1512', 0.7) }, false);
  const woman = new Dancer(W, { skin, top: lime, sleeve: skin, leg: skin, shoe: std('#d8b36a', 0.3, 0.5), hair: std('#6b4329', 0.55), dress: lime }, true);
  scene.add(man.group, woman.group);

  // ---- floor: a mirror under a dark, slightly see-through stage surface
  const floorColor = new Color(token('--bg-deep') || '#0c080a');
  let mirror: Reflector | null = null;
  if (!small && !lowPower) {
    mirror = new Reflector(new CircleGeometry(9, 48), { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: 0x8a8a8a });
    mirror.rotation.x = -Math.PI / 2;
    scene.add(mirror);
  }
  const floorMat = new MeshStandardMaterial({ color: floorColor.clone().multiplyScalar(1.6), roughness: 0.55, metalness: 0.1, transparent: !!mirror, opacity: mirror ? 0.87 : 1 });
  const floor = new Mesh(new CircleGeometry(9, 48), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- lights
  scene.add(new HemisphereLight(0xffffff, 0x222222, 0.3));
  const lamps: { light: SpotLight; cone: Mesh; tokenName: string; mix: number }[] = [];
  const addLamp = (pos: Vector3, tokenName: string, mix: number, intensity: number, angle: number, shadow: boolean, conePower: number) => {
    const light = new SpotLight(0xffffff, intensity, 22, angle, 0.55, 1.4);
    light.position.copy(pos);
    light.target.position.set(0.05, 0.6, 0);
    if (shadow) {
      light.castShadow = true;
      light.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
      light.shadow.bias = -0.0006;
      light.shadow.radius = 5;
      light.shadow.camera.near = 2;
      light.shadow.camera.far = 14;
    }
    scene.add(light, light.target);
    // the visible beam
    const h = pos.length() * 1.02;
    const g = new ConeGeometry(Math.tan(angle) * h * 0.92, h, 48, 1, true);
    g.translate(0, -h / 2, 0);
    const cone = new Mesh(
      g,
      new ShaderMaterial({
        vertexShader: coneVertex,
        fragmentShader: coneFragment,
        uniforms: { uColor: { value: new Color() }, uPower: { value: conePower } },
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
      }),
    );
    cone.position.copy(pos);
    cone.quaternion.setFromUnitVectors(v3(0, 1, 0), v3().copy(pos).sub(light.target.position).normalize());
    scene.add(cone);
    lamps.push({ light, cone, tokenName, mix });
  };
  addLamp(v3(-2.4, 5.6, 3.6), '--accent', 0.22, 120, 0.3, true, 0.5); // key, warm
  addLamp(v3(3.4, 5.2, -2.8), '--signal', 0.7, 110, 0.3, false, 0.62); // rim from behind
  addLamp(v3(-3.6, 4.8, -2.4), '--accent', 0.75, 80, 0.3, false, 0.5); // second rim

  const white = new Color('#fff4e6');
  const applyTheme = () => {
    for (const l of lamps) {
      const c = new Color(token(l.tokenName) || '#ffffff');
      l.light.color.copy(white).lerp(c, l.mix);
      (l.cone.material as ShaderMaterial).uniforms.uColor.value.copy(white).lerp(c, Math.min(1, l.mix + 0.2));
    }
    floorMat.color.set(token('--bg-deep') || '#0c080a').multiplyScalar(1.6);
  };
  applyTheme();
  window.addEventListener('themechange', applyTheme);

  // ---- size
  let offset = 0;
  let portrait = false;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    // on wide screens the dancers stand left of centre, so the text has room on the right
    offset = w > 900 ? 0.34 : 0;
    portrait = w / h < 0.8;
    camera.aspect = (w * (1 + offset)) / h;
    camera.fov = w > 900 ? 30 : portrait ? 40 : 34;
    if (offset) camera.setViewOffset(w * (1 + offset), h, w * offset, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    if (!running) frame(0, true);
  };

  // ---- loop
  let target = reduce ? 7.95 : 0;
  let current = target;
  let spinTime = 0;
  let time = 0;
  let last = 0;
  let running = false;
  let raf = 0;
  const look = v3();

  const frame = (now: number, single = false) => {
    const dt = single ? 0 : Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    time += dt;
    current += (target - current) * (single ? 1 : 1 - Math.pow(0.002, dt));
    const u = clamp(current, 0, 7.999);

    // she keeps spinning while you rest on counts 5-7
    const win = smooth(4.4, 5.0, u) * (1 - smooth(6.75, 7.1, u));
    spinTime += dt * win * 4.4;
    if (win === 0) spinTime = Math.atan2(Math.sin(spinTime), Math.cos(spinTime));

    choreo(u, time, spinTime, man, woman, reduce);
    man.finish(dt, time);
    woman.finish(dt, time);

    // camera: a slow arc around the couple, a little closer and lower for the floor spin
    const down = smooth(4.2, 5.1, u);
    const az = lerp(-0.34, 0.3, smooth(0, 8, u)) + (reduce ? 0 : Math.sin(time * 0.25) * 0.02);
    const dist = (lerp(6.6, 5.7, down) + 0.5 * smooth(7, 7.7, u)) * (portrait ? 1.12 : 1);
    camera.position.set(Math.sin(az) * dist, lerp(1.5, 1.2, down), Math.cos(az) * dist);
    look.set(0.02, lerp(0.92, 0.66, down), 0);
    camera.lookAt(look);

    renderer.render(scene, camera);
    if (!single && running) raf = requestAnimationFrame(frame);
  };

  const play = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let visible = false;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible && !document.hidden ? play() : stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden || !visible ? stop() : play());
  document.addEventListener('visibilitychange', onVis);
  if (reduce) frame(0, true);

  return {
    setCount: (u: number) => {
      target = reduce ? 7.95 : clamp(u, 0, 7.999);
      if (reduce) frame(0, true);
    },
    destroy: () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('themechange', applyTheme);
      renderer.dispose();
    },
  };
}
