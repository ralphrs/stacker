export default {
    publishers: {
        http: {
            hooks: ['onResponseReceived'],
            template: `
                <b-container fluid class="p-0 m-0">
                    <label class="pl-3 d-block carabina-text mb-2">URL</label>
                    <b-row class="px-3 mb-4" no-gutters>
                        <b-col cols="auto" class="align-self-center">
                            <dropdown-selector
                                    :defaultSelection="{value: component.method}"
                                    @select="(protocol) => $parent.updateAttribute('method', protocol.value)"
                                    :availableList="availableMethods"></dropdown-selector>
                        </b-col>
                        <b-col cols="10" class="align-self-center mt-1">
                            <stacker-input placeholder="Url" type="text"
                                           :highlightableRegex="/\\A?(\\w+=[^&]+)/g"
                                           :state="component.url.length > 0 ? null : false"
                                           @input="(value) => $parent.updateAttribute('url', value)"
                                           :value="component.url"
                                           class="text-input carabina-text px-1" trim>
                            </stacker-input>
                        </b-col>
                    </b-row>
                    <label class="pl-3 d-block carabina-text mb-0">Headers</label>
                    <key-value-table @change="(headers) => $parent.updateAttribute('headers', headers)"
                                     :table="component.headers" class="mb-4"></key-value-table>

                    <label class="pl-3 d-block carabina-text mb-2">Payload</label>
                    <payload :code="component.payload"
                             @change="(value) => $parent.updateAttribute('payload', value)"
                             class="px-3"></payload>
                </b-container>`,
            props: {
                component: {
                    url: {
                        type: String,
                        default: 'http://'
                    },
                    payload: {
                        type: String,
                        default: ''
                    },
                    headers: {
                        type: Object,
                        default: {'content-type': 'json/application'}
                    }
                }
            },
            data: function () {
                return {
                    availableMethods: [{value: 'GET'},
                        {value: 'POST'},
                        {value: 'PUT'},
                        {value: 'PATCH'},
                        {value: 'HEAD'},
                        {value: 'CONNECT'},
                        {value: 'OPTIONS'},
                        {value: 'TRACE'},
                        {value: 'DELETE'}]
                }
            },
            methods: {}
        }
    }
};