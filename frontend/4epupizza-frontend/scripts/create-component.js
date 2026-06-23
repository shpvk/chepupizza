import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем имя директории текущего скрипта
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Имя компонента передается аргументом при запуске скрипта
const componentName = process.argv[2];

if (!componentName) {
  console.error('Ошибка: Пожалуйста, укажите имя компонента!');
  console.log('Использование: npm run create-comp <ИмяКомпонента>');
  process.exit(1);
}

// Приводим первую букву к верхнему регистру (PascalCase) для соответствия стандартам React
const formattedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

// Путь к папке components
const targetDir = path.join(__dirname, '..', 'src', 'components', formattedName);

if (fs.existsSync(targetDir)) {
  console.error(`Ошибка: Компонент ${formattedName} уже существует по пути: ${targetDir}`);
  process.exit(1);
}

// Создаем папку для компонента
fs.mkdirSync(targetDir, { recursive: true });

// Шаблон JSX файла
const jsxTemplate = `import './${formattedName}.css';

function ${formattedName}() {
  return (
    <div className="${formattedName.toLowerCase()}-container">
      {/* Содержимое компонента ${formattedName} */}
    </div>
  );
}

export default ${formattedName};
`;

// Шаблон CSS файла
const cssTemplate = `.${formattedName.toLowerCase()}-container {
  /* Стили для компонента ${formattedName} */
}
`;

// Записываем файлы
fs.writeFileSync(path.join(targetDir, `${formattedName}.jsx`), jsxTemplate);
fs.writeFileSync(path.join(targetDir, `${formattedName}.css`), cssTemplate);

console.log(`\n🎉 Компонент ${formattedName} успешно создан!`);
console.log(`📂 Путь: src/components/${formattedName}/`);
console.log(`  - 📄 ${formattedName}.jsx`);
console.log(`  - 📄 ${formattedName}.css\n`);
