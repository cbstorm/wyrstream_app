export default function generate(plop) {
  plop.setGenerator('entity', {
    description: 'Generate Entity',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of entity (singular)?',
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: 'add',
          path: 'src/entities/{{name}}.entity.ts',
          templateFile: '__generator/__templates/entity.hbs',
        },
      ];
      return actions;
    },
  });
}
