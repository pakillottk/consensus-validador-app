import Code from '../Code';

export default marker = ( codeObj ) => {
    const code = codeObj.getAsPlainObject();

    code.validations++;
    
    return new Code( code );
}