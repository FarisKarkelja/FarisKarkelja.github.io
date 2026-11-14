---
title: RISC-V CPU Model
tagline: A 32-bit RISC-V CPU designed from logic gates up
summary: A team project in computer architecture - we designed a custom instruction set based on 32-bit RISC-V and built a working CPU for it in Logisim, then tested it with our own assembly programs in RARS.
year: '2025'
role: Team project
context: Computer architecture, team project
categories: [Systems, Team]
stack: [Logisim, RARS, RISC-V Assembly]
order: 11
highlights:
  - Custom instruction set based on 32-bit RISC-V
  - Full datapath - PC, ALU, registers, memory and control unit
  - Verified with assembly programs in the RARS simulator
links:
  repo: https://github.com/FarisKarkelja/riscv-cpu-model
todo:
  - Add year, tools/language and your role.
---

## The goal

Understand a CPU by building one. We defined a custom instruction set based on the 32-bit RISC-V architecture and designed a CPU in Logisim that can execute it.

## The instruction set

- Arithmetic (R-type): add, sub
- Logical (R-type): and
- Load and store (I-type and S-type): lw, sw
- Branches (B-type): beq, bne

Each instruction is mapped to its opcode, funct3 and funct7 fields, which drive the control unit.

## The CPU

The datapath connects a program counter, an ALU, a register file, instruction and data memory and an immediate generator. A control unit decodes every instruction and sets the signals that steer the data - ALUSrc, RegWrite, MemRead, MemWrite and PCSrc. Every instruction goes through five stages: fetch, decode, execute, memory access and write back.

## Testing it

We wrote sample assembly programs with arithmetic, memory access and conditional branching, and stepped through them in the RARS simulator to check that every instruction behaved as designed.

## What it shows

How software really runs: what an instruction is at the level of bits and signals, and why the hardware is designed the way it is. It is the foundation under every line of code I write.