declare module '*.pug' {
  const value: <T extends Record<string, any>>(values?: T) => string;
  export default value;
}
