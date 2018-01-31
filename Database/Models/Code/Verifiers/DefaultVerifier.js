import CodeVerifier from './CodeVerifier';

const rules = [
    {
        values: [
            {type: 'field', value: 'maxValidations' }
        ],
        validate: function( _values ) {
            if( _values[0] === -1 ) {
                return { action: "break", message: "No escaneable" };
            } else {
                return { action: "continue" };
            }
        }
    },
    {
        values: [
            {type:'scan_mode'},
            {type:'field', value:'out'}
        ],
        validate: function (_values) {
            var validStatus = { action: "continue" };
            var notValidStatus = { action: "break", message: "" };
            if (_values[0] === "E") {
                if (_values[1] === null || _values[1] === true) {
                    return validStatus;
                } else {
                    return Object.assign(notValidStatus, { message: "Ya está dentro" } );
                }
            } else if (_values[0] === "O") {
                if (_values[1] === null || _values[1] === false) {
                    return validStatus;
                } else {
                    return Object.assign(notValidStatus, { message: "Ya está fuera" });
                }
            }
        }
    },
    {
        values: [
            { type: 'field', value: 'maxValidations' }
        ],
        validate: function (_values) {
            if ( _values[0] === 0 ) {
                return { action: 'complete' };
            } else {
                return { action: 'continue' };
            }
        }
    },
    {
        values: [
            { type: 'field', value: 'validations' },
            { type: 'field', value: 'maxValidations' }
        ],
        validate: function (_values) {
            if (_values[0] < _values[1]) {
                return { action: 'complete' };
            } else {
                return { action: 'break', message: 'Alcanzado máximo de escaneos' };
            }
        }
    }
];

export default new CodeVerifier( rules );