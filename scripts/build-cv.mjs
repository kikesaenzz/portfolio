// Genera el CV en Word a partir de src/data/profile.ts (la misma fuente que la web).
// Uso: npm run cv   (genera el .docx y luego el PDF con Word)
import { writeFileSync } from 'node:fs';
import {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, Table, TableRow, TableCell,
  WidthType, BorderStyle, LevelFormat, AlignmentType,
} from 'docx';
import {
  profile, summary, jobs, cases, stack, education, extra,
} from '../src/data/profile.ts';

const FONT = 'Times New Roman';
const BASE = 20; // 10 pt
const rule = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const run = (text, o = {}) => new TextRun({ text, font: FONT, color: '000000', size: BASE, ...o });

const heading = (text) => new Paragraph({
  border: { bottom: { ...rule, space: 4 } },
  spacing: { before: 220, after: 100 },
  keepNext: true,
  children: [run(text, { bold: true, size: 21, characterSpacing: 8 })],
});
const para = (children, o = {}) => new Paragraph({ spacing: { after: 60 }, ...o, children });
const bullet = (text, after = 40) => new Paragraph({
  numbering: { reference: 'bul', level: 0 }, spacing: { after }, children: [run(text)],
});
const titleLine = (bold, rest) => new Paragraph({
  spacing: { before: 140, after: 40 }, keepNext: true,
  children: [run(bold, { bold: true, size: 21 }), run(rest ? '  |  ' + rest : '')],
});

const children = [];

// Cabecera
children.push(new Paragraph({ spacing: { after: 40 }, children: [run(profile.name.toUpperCase(), { bold: true, size: 40 })] }));
children.push(new Paragraph({ spacing: { after: 120 }, children: [run('DESARROLLADOR BACKEND · JAVA, PHP Y PYTHON', { size: 22, characterSpacing: 10 })] }));
children.push(new Paragraph({
  border: { bottom: { ...rule, space: 8 } }, spacing: { after: 200 },
  children: [
    run(`${profile.email}   ${profile.phone}   ${profile.city}   `, { size: 19 }),
    new ExternalHyperlink({ link: 'https://' + profile.web, children: [run(profile.web, { size: 19, underline: {} })] }),
  ],
}));

// Acerca de mí
children.push(heading('ACERCA DE MÍ'));
children.push(para([run(summary)]));

// Experiencia
children.push(heading('EXPERIENCIA PROFESIONAL'));
for (const j of jobs) {
  children.push(titleLine(j.role, `${j.org}  |  ${j.period}`));
  if (j.intro) children.push(para([run(j.intro)]));
  j.bullets.forEach((b) => children.push(bullet(b)));
  // La lista de herramientas va en HABILIDADES E IDIOMAS, no se repite aquí
}

// Proyectos
children.push(heading('PROYECTOS PARA CLIENTES'));
for (const c of cases) {
  children.push(titleLine(c.title, `${c.client}  |  ${c.period}`));
  children.push(new Paragraph({ spacing: { after: 40 }, keepNext: true, children: [run(c.role, { italics: true })] }));
  c.bullets.forEach((b) => children.push(bullet(b)));
  children.push(para([run('Entorno tecnológico: ', { bold: true }), run(c.stack.join(', ') + '.')], { spacing: { before: 20, after: 60 } }));
}

// Formación
children.push(heading('TITULACIÓN ACADÉMICA'));
for (const d of education.degrees) {
  children.push(para([run(d.t, { bold: true }), run(`  —  ${d.s}  |  ${d.d}`)]));
}
children.push(heading('FORMACIÓN COMPLEMENTARIA'));
for (const d of education.courses) {
  children.push(para([run(d.t, { bold: true }), run(`  —  ${d.s}` + (d.d ? `  |  ${d.d}` : ''))]));
}
children.push(bullet(education.inProgress + '.'));

// Habilidades e idiomas (dos columnas)
children.push(heading('HABILIDADES E IDIOMAS'));
const skillGroups = stack.filter((g) => g.t !== 'Idiomas');
const half = Math.ceil(skillGroups.length / 2);
const col = (items) => items.flatMap((g) => [
  new Paragraph({ spacing: { before: 100, after: 20 }, children: [run(g.t, { bold: true })] }),
  new Paragraph({ children: [run(g.c.join(', '))] }),
]);
const langs = stack.find((g) => g.t === 'Idiomas').c;
const rightCol = [
  ...col(skillGroups.slice(half)),
  new Paragraph({ spacing: { before: 100, after: 20 }, children: [run('Idiomas', { bold: true })] }),
  ...langs.map((l) => new Paragraph({ children: [run(l.replace('·', '—'))] })),
  new Paragraph({ spacing: { before: 100, after: 20 }, children: [run('Más información', { bold: true })] }),
  ...extra.map((e) => new Paragraph({ children: [run(e)] })),
];
const cell = (kids) => new TableCell({
  width: { size: 50, type: WidthType.PERCENTAGE },
  margins: { right: 200 },
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
  children: kids,
});
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
  rows: [new TableRow({ children: [cell(col(skillGroups.slice(0, half))), cell(rightCol)] })],
}));

const doc = new Document({
  creator: profile.name,
  title: `CV ${profile.name}`,
  styles: { default: { document: { run: { font: FONT, size: BASE } } } },
  numbering: {
    config: [{
      reference: 'bul',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '●', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 } }, run: { size: 14 } },
      }],
    }],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    children,
  }],
});

const buf = await Packer.toBuffer(doc);
writeFileSync('CV_Enrique_Saenz_de_Urturi.docx', buf);
console.log('CV .docx generado');
