import DefaultVerifier from './Verifiers/DefaultVerifier';
import CodeMarker from './Markers/CodeMarker';

export default class Code {
    static Verifier = DefaultVerifier;
    static Marker   = CodeMarker;

    constructor( data ) {
        const { 
            id, 
            code, 
            name, 
            email, 
            maxValidations, 
            validations, 
            created_at, 
            updated_at 
        } = data;

        this.id             = id || null;
        this.code           = code || null;
        this.name           = name || null;
        this.email          = email || null;
        this.maxValidations = maxValidations || -1;
        this.validations    = validations || 0;
        this.created_at     = created_at || null;
        this.updated_at     = updated_at || null;
    }

    getAsPlainObject() {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            email: this.email,
            maxValidations: this.maxValidations,
            validations: this.validations,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
    
    //Check if code is valid
    verify( scanMode ) {
        return Code.Verifier.verify( this, scanMode );
    }

    //Get the next code state after validation
    marked() {
        return Code.Marker.mark( this );
    }
}   