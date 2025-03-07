# turn-based-combat-system/turn-based-combat-system/README.md

# Turn-Based Combat System

This project implements a turn-based combat system inspired by games like Honkai: Star Rail. It features a class structure that allows for the management of characters, enemies, and the battle timeline.

## Project Structure

- `src/battle.ts`: Contains the `Battle` class that manages the combat system, including arrays of characters and enemies, as well as the battle timeline.
  
- `src/characters/character.ts`: Exports the `Character` class, representing a character in battle with properties like `name`, `health`, `attack`, and methods such as `attackEnemy` and `takeDamage`.
  
- `src/enemies/enemy.ts`: Exports the `Enemy` class, which inherits from `Character` and represents enemies in battle. It may include additional properties like `specialAbility` and enemy-specific methods.
  
- `src/timeline.ts`: Contains the `Timeline` class that manages the order of turns in battle, storing information about the current state of the battle and the turn order.
  
- `src/types/index.ts`: Exports types and interfaces used in the project, such as `CharacterStats`, `BattleResult`, and `Action`.
  
- `tsconfig.json`: TypeScript configuration file that defines compilation parameters, such as the target JavaScript version and included files.
  
- `package.json`: npm configuration file that contains project dependencies and scripts for building and running the project.

## Installation

To install the project, clone the repository and run:

```
npm install
```

## Usage

To start the project, use the following command:

```
npm start
```

This will compile the TypeScript files and run the application. 

## Contributing

Feel free to submit issues or pull requests if you would like to contribute to the project!

## Установка

1. Убедитесь, что у вас установлен Node.js.
2. Клонируйте репозиторий:
    ```bash
    git clone /Users/wendor/git/turn-based-combat-system
    ```
3. Перейдите в директорию проекта:
    ```bash
    cd turn-based-combat-system
    ```
4. Установите зависимости:
    ```bash
    npm install
    ```

## Запуск

1. Запустите проект:
    ```bash
    npx ts-node main.ts
    ```

## Тестирование

1. Запустите тесты (если они есть):
    ```bash
    npm test
    ```