export default class CodeVerifier {
    constructor( rules ) {
        this.rules = rules;
    }

    returnValidCode( verificationResult ) {
        return {
            verification: 'valid',
            message: 'The code is valid'
        };
    }

    returnNotValidCode( verificationResult ) {
        return {
            verification:'not_valid',
            error: verificationResult.message
        };
    }

    verify( codeObj, scanMode ) {
        const code = code.getAsPlainObject();

        console.log( "checking code: " + code.code );
        const rules = this.rules;
        for( let j = 0; j < rules.length; j++ ){
            const rule = rules[ j ];

            console.log( "evaluating rule: " + j );

            const values = [];
            for( let i = 0; i < rule.values.length; i++ ) {
                switch( rule.values[i].type ) {
                    case "field": {
                        values.push( code[ rule.values[i].value ] );
                        break;
                    }
                    case "literal": {
                        values.push(  rule.values[i].value );
                        break;
                    }
                    case "scan_mode": {
                        values.push( scanMode );
                        break;
                    }
                }
            }
            const result = rule.validate( values );
            if( result.action === "complete" ) {
                console.info(code.code + " is valid!");
                return this.returnValidCode( result ) ;
            } else if (result.action === "break") {
                console.error(code.code + " is not valid! ");
                console.error(result.message);
                return this.returnNotValidCode( verificationResult );
            }
        };
    }
}