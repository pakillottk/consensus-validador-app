import Code from '../Code';

const marker = ( codeObj ) => {
    const code = codeObj.getAsPlainObject();

    code.validations++;
    
    return new Code( code );
}