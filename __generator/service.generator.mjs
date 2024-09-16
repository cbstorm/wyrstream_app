export default function generate(plop) {
  plop.setGenerator('service', {
    description: 'Generate service',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of service (singular)?',
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: 'add',
          path: 'src/services/{{name}}.service.ts',
          templateFile: '__generator/__templates/service.hbs',
        },
      ];
      return actions;
    },
  });
}
