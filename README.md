# OpenMineSweeper

## Supported Platforms

- Android : fully supported
- iOS : might be supported but not tested

## Setup the development environment 

You only need to have `expo` with node package manager (`npm`) installed on your machine.
To run the game in development mode, juste tap `npm start` in your terminal at the root of the project.

To build the game with expo, use the command `eas build --platform <android|ios> --profile preview`.

## Code structure

- `app/` : main app and routing
- `assets/` : global assets
- `components/` : components used in the app
- `hooks/` : custom hooks used within the app
- `providers/` : custom providers
