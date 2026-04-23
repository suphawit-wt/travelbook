import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'src');
const FSD_LAYERS = ['shared', 'entities', 'features', 'widgets'];
const NEW_SLICE_CHOICE = '__create_slice__';
const SEGMENT_CHOICES = [
  { name: 'ui', value: 'ui' },
  { name: 'model', value: 'model' },
  { name: 'lib', value: 'lib' },
  { name: 'api', value: 'api' },
  { name: 'hooks', value: 'hooks' },
  { name: 'store', value: 'store' },
  { name: 'config', value: 'config' },
  { name: 'Custom…', value: '__custom__' },
];

const getDirectories = (targetPath) => {
  if (!fs.existsSync(targetPath)) {
    return [];
  }

  return fs
    .readdirSync(targetPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();
};

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

const getSliceHelpText = (layer) => {
  const slices = getDirectories(path.join(ROOT, layer));

  if (!slices.length) {
    return 'No slices found yet, a new one will be created.';
  }

  return `Existing slices: ${slices.join(', ')}`;
};

/** @type {import('plop').PlopGeneratorConfig} */
export const component = {
  description: 'Creates a new component that follows the FSD conventions',
  prompts: [
    {
      type: 'list',
      name: 'layer',
      message: 'Select the FSD layer for the component',
      choices: FSD_LAYERS,
    },
    {
      type: 'input',
      name: 'sharedSection',
      message:
        'Which section inside shared should host the component? (e.g. ui)',
      when: ({ layer }) => layer === 'shared',
      default: 'ui',
      validate: (value) =>
        value.trim() ? true : 'Shared section is required (try "ui").',
    },
    {
      type: 'list',
      name: 'sliceChoice',
      message: (answers) =>
        `Select the slice inside ${answers.layer}. ${getSliceHelpText(answers.layer)}`,
      when: ({ layer }) => layer !== 'shared',
      choices: (answers) => {
        const slices = getDirectories(path.join(ROOT, answers.layer));

        const existingChoices = slices.map((slice) => ({
          name: slice,
          value: slice,
        }));

        return [
          ...existingChoices,
          { name: 'Create new slice…', value: NEW_SLICE_CHOICE },
        ];
      },
      default: (answers) => {
        const slices = getDirectories(path.join(ROOT, answers.layer));

        return slices[0] ?? NEW_SLICE_CHOICE;
      },
    },
    {
      type: 'input',
      name: 'slice',
      message: (answers) =>
        `Name the new slice to create inside ${answers.layer}`,
      when: ({ layer, sliceChoice }) =>
        layer !== 'shared' && sliceChoice === NEW_SLICE_CHOICE,
      validate: (value) =>
        value.trim() ? true : 'Slice name cannot be empty.',
    },
    {
      type: 'list',
      name: 'segment',
      message: 'Select the segment inside the slice',
      when: ({ layer }) => layer !== 'shared',
      choices: SEGMENT_CHOICES,
      default: 'ui',
    },
    {
      type: 'input',
      name: 'customSegment',
      message: 'Name the custom segment',
      when: ({ layer, segment }) =>
        layer !== 'shared' && segment === '__custom__',
      validate: (value) =>
        value.trim() ? true : 'Custom segment name cannot be empty.',
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the component?',
    },
    {
      type: 'checkbox',
      name: 'componentTypes',
      message: 'Select Type of Components you want to add.',
      choices: [
        { name: 'Types', value: 'types.d.ts' },
        { name: 'Styled Components', value: 'styled.ts' },
        { name: 'Storybook', value: 'stories.ts' },
        { name: 'Test', value: 'test.tsx' },
      ],
    },
  ],
  actions: (answers) => {
    const layer = answers.layer;
    const componentName = answers.name.trim();
    const componentTypes = Array.isArray(answers.componentTypes)
      ? answers.componentTypes
      : [];

    answers.hasStyled = componentTypes.includes('styled.ts');
    answers.hasTypes = componentTypes.includes('types.d.ts');
    answers.hasStories = componentTypes.includes('stories.ts');
    answers.hasTest = componentTypes.includes('test.tsx');

    const rawSegment =
      layer === 'shared'
        ? answers.sharedSection
        : answers.segment === '__custom__'
          ? answers.customSegment
          : answers.segment;

    const normalizedSection = toKebabCase((rawSegment ?? 'ui').trim());

    const rawSlice =
      layer === 'shared'
        ? null
        : answers.sliceChoice === NEW_SLICE_CHOICE
          ? answers.slice
          : answers.sliceChoice;

    let normalizedSlice = null;

    if (rawSlice) {
      const trimmedSlice = rawSlice.trim();
      answers.slice = trimmedSlice;
      normalizedSlice = toKebabCase(trimmedSlice);
    }

    if (layer !== 'shared' && !normalizedSlice) {
      throw new Error('Slice name could not be determined.');
    }

    const componentDirectorySegments =
      layer === 'shared'
        ? ['..', 'src', layer, normalizedSection, toKebabCase(componentName)]
        : [
            '..',
            'src',
            layer,
            normalizedSlice,
            normalizedSection,
            toKebabCase(componentName),
          ];

    const componentDirectory = path.posix.join(...componentDirectorySegments);

    const componentFileName = `${toKebabCase(componentName)}.tsx`;

    const actions = [
      {
        type: 'add',
        path: path.posix.join(componentDirectory, 'index.ts'),
        templateFile: 'templates/component/index.ts.hbs',
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: 'add',
        path: path.posix.join(componentDirectory, componentFileName),
        templateFile: 'templates/component/component.tsx.hbs',
        abortOnFail: true,
        skipIfExists: true,
      },
    ];

    componentTypes.forEach((componentTypeFile) => {
      actions.push({
        type: 'add',
        path: path.posix.join(
          componentDirectory,
          `${toKebabCase(componentName)}.${componentTypeFile}`,
        ),
        templateFile: path.posix.join(
          'templates',
          'component',
          `${componentTypeFile}.hbs`,
        ),
        abortOnFail: true,
        skipIfExists: true,
      });
    });

    if (layer === 'shared' && normalizedSection === 'ui') {
      actions.push(() => {
        const exportsFile = path.join(ROOT, 'shared', 'ui', 'index.ts');
        const exportLine = `export * from './${toKebabCase(componentName)}';`;

        if (!fs.existsSync(exportsFile)) {
          return `Skipped exports update (missing ${exportsFile}).`;
        }

        const content = fs.readFileSync(exportsFile, 'utf8');

        if (content.includes(exportLine)) {
          return `Export already exists in ${exportsFile}.`;
        }

        fs.appendFileSync(exportsFile, `${exportLine}\n`);

        return `Updated ${path.relative(process.cwd(), exportsFile)}.`;
      });
    }

    return actions;
  },
};
