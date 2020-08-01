const replaceJsonVariable = (str: string, variableName: string, variableContent: string): string => {
    return str.replace(`{${variableName}}`, variableContent);
}

export default replaceJsonVariable;