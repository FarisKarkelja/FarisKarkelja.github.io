/* The portfolio terminal: Ctrl/Cmd + K, the backtick key, the header button or the hero status card. */
import { getTheme, setTheme } from './theme';

type Data = {
  name: string;
  summary: string;
  status: { key: string; value: string; live?: boolean }[];
  email: string;
  github: string;
  linkedin: string;
  cvPdf: string;
  projects: { slug: string; title: string; tagline: string; url: string }[];
  skills: { group: string; items: string[] }[];
  themes: { id: string; note: string }[];
};

type Command = { help: string; run: (args: string[]) => void; hidden?: boolean; args?: () => string[] };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initTerminal() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-terminal]');
  if (!dialog) return;
  const frame = dialog.querySelector<HTMLElement>('[data-terminal-frame]')!;
  const out = dialog.querySelector<HTMLElement>('[data-terminal-out]')!;
  const screen = dialog.querySelector<HTMLElement>('[data-terminal-screen]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-terminal-form]')!;
  const input = dialog.querySelector<HTMLInputElement>('[data-terminal-input]')!;
  const ghostTyped = dialog.querySelector<HTMLElement>('[data-ghost-typed]')!;
  const ghostRest = dialog.querySelector<HTMLElement>('[data-ghost-rest]')!;
  const data: Data = JSON.parse(dialog.querySelector('[data-terminal-data]')!.textContent || '{}');

  const history: string[] = [];
  let hIndex = -1;
  let booted = false;

  const print = (html: string) => {
    const p = document.createElement('p');
    p.innerHTML = html;
    out.appendChild(p);
  };
  const gap = () => {
    const d = document.createElement('div');
    d.className = 'gap';
    out.appendChild(d);
  };
  const scroll = () => (screen.scrollTop = screen.scrollHeight);
  const home = () => location.pathname === '/' || location.pathname === '';

  const go = (url: string) => {
    dialog.close();
    if (url.startsWith('#')) {
      if (!home()) {
        window.location.href = '/' + url;
        return;
      }
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
      if (lenis) lenis.scrollTo(url);
      else document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
    } else if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.href = url;
    }
  };

  const findProject = (q: string) => {
    const n = Number(q);
    if (q && Number.isInteger(n)) return data.projects[n - 1];
    return data.projects.find((p) => p.slug === q) ?? data.projects.find((p) => p.slug.includes(q) || p.title.toLowerCase().includes(q));
  };

  const commands: Record<string, Command> = {
    help: {
      help: 'list commands',
      run: () => {
        Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .forEach(([name, c]) => print(`<span class="tty-cmd">${name.padEnd(9)}</span><span class="tty-dim">${c.help}</span>`));
      },
    },
    status: {
      help: 'who I am, in five lines',
      run: () =>
        data.status.forEach((row) =>
          print(`<span class="tty-dim">${esc(row.key.padEnd(13))}</span>${row.live ? '<span class="tty-ok">● </span>' : ''}${esc(row.value)}`),
        ),
    },
    whoami: { help: 'the longer version', run: () => print(esc(data.summary)) },
    work: {
      help: 'list projects, then: open <number>',
      run: () => {
        data.projects.forEach((p, i) =>
          print(`<span class="tty-cmd">${String(i + 1).padStart(2)}</span>  ${esc(p.title)} <span class="tty-dim">- ${esc(p.tagline)}</span>`),
        );
        print('<span class="tty-dim">type: open 1</span>');
      },
    },
    open: {
      help: 'open a project by number or name',
      args: () => data.projects.map((p) => p.slug),
      run: (args) => {
        const q = args.join(' ').toLowerCase();
        if (!q) return print('usage: open &lt;number or name&gt;');
        const p = findProject(q);
        if (!p) return print(`open: no project matches "${esc(q)}". Type <span class="tty-cmd">work</span> to see the list.`);
        print(`<span class="tty-ok">opening ${esc(p.title)}...</span>`);
        setTimeout(() => go(p.url), 250);
      },
    },
    skills: {
      help: 'tech I work with',
      run: () => data.skills.forEach((g) => print(`<span class="tty-cmd">${esc(g.group.padEnd(19))}</span>${esc(g.items.join(', '))}`)),
    },
    stage: {
      help: 'the other stage',
      run: () => {
        print('<span class="tty-ok">dimming the lights...</span>');
        setTimeout(() => go('#stage'), 300);
      },
    },
    contact: {
      help: 'email, LinkedIn, GitHub',
      run: () => {
        print(`email     <a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`);
        print(`linkedin  <a href="${esc(data.linkedin)}" target="_blank" rel="noopener">${esc(data.linkedin.replace('https://www.', '').replace(/\/$/, ''))}</a>`);
        print(`github    <a href="${esc(data.github)}" target="_blank" rel="noopener">${esc(data.github.replace('https://', ''))}</a>`);
        navigator.clipboard?.writeText(data.email).then(
          () => {
            print('<span class="tty-ok">email copied to clipboard</span>');
            scroll();
          },
          () => {},
        );
      },
    },
    cv: {
      help: 'download my CV (PDF)',
      run: () => {
        print('<span class="tty-ok">downloading CV...</span>');
        const a = document.createElement('a');
        a.href = data.cvPdf;
        a.download = '';
        a.click();
      },
    },
    theme: {
      help: 'change the colours: theme <name>',
      args: () => [...data.themes.map((t) => t.id), 'next'],
      run: (args) => {
        const current = getTheme();
        let name = (args[0] || '').toLowerCase();
        if (name === 'next') {
          const i = data.themes.findIndex((t) => t.id === current);
          name = data.themes[(i + 1) % data.themes.length].id;
        }
        if (!name) {
          data.themes.forEach((t) =>
            print(`${t.id === current ? '<span class="tty-ok">*</span>' : ' '} <span class="tty-cmd">${t.id.padEnd(9)}</span><span class="tty-dim">${esc(t.note)}</span>`),
          );
          print('<span class="tty-dim">type: theme midnight (or theme next)</span>');
          return;
        }
        if (setTheme(name)) print(`<span class="tty-ok">theme set to ${esc(name)}</span>`);
        else print(`theme: "${esc(name)}" does not exist. Try: ${data.themes.map((t) => t.id).join(', ')}`);
      },
    },
    clear: { help: 'clear the screen', run: () => (out.innerHTML = '') },
    exit: { help: 'close the terminal', run: () => dialog.close() },

    // easter eggs
    sudo: {
      help: '',
      hidden: true,
      run: (args) => {
        if (args.join(' ').toLowerCase().startsWith('hire faris')) {
          print('[sudo] password for recruiter: ********');
          print('<span class="tty-ok">access granted. great decision.</span>');
          setTimeout(() => go('#contact'), 900);
        } else {
          print('recruiter is not in the sudoers file. try: sudo hire faris');
        }
      },
    },
    dance: {
      help: '',
      hidden: true,
      run: () => {
        const p = document.createElement('p');
        out.appendChild(p);
        const beats = ['1', '2', '3', '<span class="tty-dim">(pause)</span>', '5', '6', '7', '<span class="tty-dim">(pause)</span>'];
        let i = 0;
        const step = () => {
          p.innerHTML += (i ? '  ' : '') + beats[i];
          scroll();
          if (++i < beats.length) setTimeout(step, reduceMotion() ? 0 : 260);
          else print('<span class="tty-ok">that is one bar of salsa. type stage to see it danced.</span>');
        };
        step();
      },
    },
    rm: { help: '', hidden: true, run: () => print('nice try. this portfolio is under version control.') },
    hello: { help: '', hidden: true, run: () => print('hi! type <span class="tty-cmd">help</span> to see what I can do.') },
  };
  const aliases: Record<string, string> = { ls: 'work', projects: 'work', hi: 'hello', email: 'contact', resume: 'cv', q: 'exit', about: 'whoami', themes: 'theme', salsa: 'dance' };
  const resolve = (name: string) => commands[name] ?? commands[aliases[name]];

  /* ---------- autocomplete: grey suggestion after the cursor, Tab or right arrow accepts ---------- */
  const visible = Object.keys(commands).filter((c) => !commands[c].hidden);
  const suggest = (value: string): string => {
    if (!value) return '';
    const lower = value.toLowerCase();
    const space = lower.indexOf(' ');
    if (space === -1) {
      const hit = visible.find((c) => c.startsWith(lower) && c !== lower);
      return hit ? value + hit.slice(lower.length) : '';
    }
    const cmd = resolve(lower.slice(0, space));
    const partial = lower.slice(space + 1);
    if (!cmd?.args || partial.includes(' ')) return '';
    const hit = cmd.args().find((a) => a.startsWith(partial) && a !== partial);
    return hit ? value + hit.slice(partial.length) : '';
  };
  const updateGhost = () => {
    const s = input.selectionStart === input.value.length ? suggest(input.value) : '';
    ghostTyped.textContent = input.value;
    ghostRest.textContent = s ? s.slice(input.value.length) : '';
  };
  const accept = () => {
    const s = suggest(input.value);
    if (!s) return false;
    const cmd = resolve(s.trim().toLowerCase());
    input.value = cmd?.args && !s.includes(' ') ? s + ' ' : s;
    updateGhost();
    return true;
  };

  const run = (raw: string) => {
    const line = raw.trim();
    print(`<span class="tty-cmd">faris@sarajevo:~$ ${esc(line)}</span>`);
    if (!line) return scroll();
    history.unshift(line);
    hIndex = -1;
    const [name, ...args] = line.split(/\s+/);
    const cmd = resolve(name.toLowerCase());
    if (cmd) cmd.run(args);
    else print(`command not found: ${esc(name)}. type <span class="tty-cmd">help</span>`);
    gap();
    scroll();
  };

  const boot = (withStatus: boolean) => {
    if (booted) return;
    booted = true;
    if (withStatus) run('status');
    print(`<span class="tty-dim">This is ${esc(data.name)}'s portfolio as a terminal. Type</span> <span class="tty-cmd">help</span><span class="tty-dim">, or pick a command below.</span>`);
    gap();
  };

  /** Open the dialog. When it is opened from the hero status card, the card grows into the terminal. */
  const open = (from?: HTMLElement | null) => {
    if (dialog.open) return;
    const card = from?.closest<HTMLElement>('[data-tty-card]') ?? null;
    boot(!!card);
    const show = () => {
      dialog.showModal();
      input.focus();
      scroll();
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (card && doc.startViewTransition && !reduceMotion()) {
      card.style.viewTransitionName = 'tty';
      dialog.style.animation = 'none';
      const t = doc.startViewTransition(() => {
        card.style.viewTransitionName = '';
        frame.style.viewTransitionName = 'tty';
        show();
      });
      t.finished.finally(() => {
        frame.style.viewTransitionName = '';
        dialog.style.animation = '';
      });
    } else {
      show();
    }
  };

  document.querySelectorAll<HTMLElement>('[data-terminal-open]').forEach((b) => b.addEventListener('click', () => open(b)));
  dialog.querySelector('[data-terminal-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close(); // click on the backdrop
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-terminal-chip]').forEach((b) =>
    b.addEventListener('click', () => {
      run(b.dataset.terminalChip || '');
      input.focus();
    }),
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
    updateGhost();
  });

  input.addEventListener('input', updateGhost);
  input.addEventListener('keyup', updateGhost);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      if (hIndex < history.length - 1) input.value = history[++hIndex];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      hIndex = Math.max(-1, hIndex - 1);
      input.value = hIndex === -1 ? '' : history[hIndex];
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      accept();
    } else if (e.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      if (accept()) e.preventDefault();
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
    }
  });

  window.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement;
    const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    } else if (e.key === '`' && !typing) {
      e.preventDefault();
      open();
    }
  });
}
