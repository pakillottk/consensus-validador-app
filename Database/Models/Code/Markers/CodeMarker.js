import Code from '../Code';

export default marker = ( codeObj ) => {
    const code = codeObj.getAsPlainObject();

    code.validations++;
    code.out        = !code.out;
    code.updated_at = new Date();
    
    return new Code( code );
}