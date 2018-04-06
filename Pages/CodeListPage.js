import React from 'react'
import { ScrollView, View, FlatList, Text, TextInput, Picker } from 'react-native'

export default class CodeListPage extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            collectionOptions: [],
            selectedCollection: -1,
            codes: [],
            codeFilter: ''
        }
    }

    componentWillMount() {
        const options = []
        const { collections } = this.props
        collections.forEach( (collection, index) => {
            options.push({
                value: index,
                label: collection.type.type
            })
        })

        this.setState({collectionOptions: options})
    }

    selectCollection( index ) {
        this.loadCollection( this.props.collections[ index ], this.state.codeFilter )
        this.setState({selectedCollection: index})
    }

    updateFilter( value ) {
        this.loadCollection( this.props.collections[ this.state.selectedCollection ], this.state.codeFilter )
        this.setState({codeFilter: value})
    }

    async loadCollection( collection, filter ) {
        if( !collection ) {
            this.setState({ codes: [] })
            return
        }

        const codeFilter = filter.trim() !== "" ? {code: new RegExp(filter, 'gi') } : {} 
        const codes = await collection.getCodes(codeFilter)
        this.setState({codes: codes})
    }

    renderListHeader() {
        const selectedCollection = this.props.collections[ this.state.selectedCollection ];
        return(
            <View>
                <View style={{backgroundColor: '#bbb'}}>
                    <Picker
                        selectedValue={this.state.selectedCollection}
                        onValueChange={( value, index ) => this.selectCollection(value)}
                    >
                        <Picker.Item label="SELECCIONE COLECCIÓN" value={-1} />
                        { this.state.collectionOptions.map( (option, index) => <Picker.Item key={index} label={option.label} value={option.value} /> ) }
                    </Picker>
                    <Text style={{color: '#333', textAlign: 'center'}}>BUSCAR CÓDIGO</Text>
                    <TextInput onChangeText={(text) => this.updateFilter(text)} value={this.state.codeFilter}/>
                </View>
                <View style={{backgroundColor:'#eee', borderBottomWidth: 1, borderBottomColor:'#bbb'}}>
                    <Text style={{textAlign:'center', color: 'black', fontSize: 15}}>
                        TOTAL CÓDIGOS: {this.state.codes.length} ({selectedCollection ? selectedCollection.validated : 0} escaneadas)
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        return(
            <FlatList 
                ListHeaderComponent={this.renderListHeader()}
                data={this.state.codes}
                keyExtractor={(item) => item.id}
                renderItem={(item) => {
                    const code = item.item
                    return(
                        <View style={{backgroundColor: code.validations > 0 ? '#aaa' : '#fff', borderBottomWidth: 0.5, borderBottomColor: '#ccc'}}>
                            <Text style={{textAlign:'center', fontSize: 10, color: code.validations > 0 ? '#ddd' : 'black'}}>{code.out ? "ESTÁ FUERA" : 'ESTÁ DENTRO' }</Text>
                            <Text style={{textAlign:'center', fontSize: 15, fontWeight: 'bold', color: code.validations > 0 ? '#ddd' : 'black'}}>{code.code}</Text>
                            <Text style={{textAlign:'center', fontSize: 10, color: code.validations > 0 ? '#ccc' : '#555'}}>{code.name} ({code.email})</Text>
                            <Text style={{textAlign:'center', fontSize: 10, color: code.validations > 0 ? '#ccc' : '#555'}}>ESCANEADO: {code.validations} veces</Text>
                        </View>
                    )
                }}
            />        
        )
    }
}