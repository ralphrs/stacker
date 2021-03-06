module.exports = {
    name: 'anydb',
    version: '0.0.1',
    publishers: {
        anydb: {
            urlHelp: 'https://www.npmjs.com/package/any-db',
            dependencies: ['enqueuer-plugin-anydb'],
            hooks: ['onQueryCompleted'],
            template: `
                <b-container fluid class="p-0 m-0">
                    <b-row class="px-3 mb-4" no-gutters align-h="between">
                        <b-col cols="auto" class="align-self-center">
                            <label class="d-block carabina-text">Driver</label>
                            <dropdown-selector
                                    :defaultSelection="{value: options.driver}"
                                    @select="onDriverChange"
                                    :availableList="availableDrivers"></dropdown-selector>
                        </b-col>
                        <b-col cols="4" class="align-self-center px-2">
                            <label class="d-block carabina-text mb-3">Host</label>
                            <stacker-input placeholder="Hostname" type="text"
                                           :highlightable-regex="/:\\d+/g"
                                           @input="onHostnameChange"
                                           :value="options.hostname"
                                           class="text-input carabina-text" trim>
                            </stacker-input>
                        </b-col>
                        <b-col cols="4" class="align-self-center">
                            <label class="d-block carabina-text mb-3">Database</label>
                            <stacker-input placeholder="Database" type="text"
                                           @input="onDatabaseChange"
                                           :value="options.database"
                                           class="text-input carabina-text" trim>
                            </stacker-input>
                        </b-col>
                    </b-row>
                    <b-row class="px-3 mb-4" no-gutters align-h="between">
                        <b-col cols="6" class="align-self-center pr-3">
                            <label class="d-block carabina-text mb-2">User</label>
                            <stacker-input placeholder="User" type="text"
                                           @input="onUserChange"
                                           :value="options.user"
                                           class="text-input carabina-text" trim>
                            </stacker-input>
                        </b-col>
                        <b-col cols="6" class="align-self-center pl-3">
                            <label class="d-block carabina-text mb-2">Password</label>
                            <stacker-input placeholder="Password"
                                           @input="onPasswordChange"
                                           :value="options.password"
                                           class="text-input carabina-text" trim>
                            </stacker-input>
                        </b-col>
                    </b-row>

                    <label class="pl-3 d-block carabina-text mb-2">Params</label>
                    <stacker-list
                            @input="onParamsChange"
                            :table="options" class="mb-4"></stacker-list>
                    <label class="pl-3 d-block carabina-text mb-2">Query</label>
                    <payload :code="query"
                             @change="onQueryChange"
                             class="px-3"></payload>
                </b-container>
            `,
            props: {
                component: {
                    options: {
                        driver: String,
                        hostname: String,
                        database: String,
                        user: String,
                        password: String,
                    },
                    params: Array,
                    query: String,
                }
            },
            data: function () {
                const content = this.getContent();
                return {
                    ...content,
                    availableDrivers: ['postgres', 'mssql', 'mysql', 'sqlite3'].map(driver => ({value: driver}))
                }
            },
            watch: {
                component: function () {
                    const content = this.getContent();
                    this.options = content.options;
                    this.params = content.params;
                    this.query = content.query;
                    this.$parent.updateAttribute('options', this.options);
                    this.$parent.updateAttribute('params', this.params);
                    this.$parent.updateAttribute('query', this.query);
                }
            },
            mounted: function () {
                this.$parent.updateAttribute('options', this.options);
                this.$parent.updateAttribute('params', this.params);
                this.$parent.updateAttribute('query', this.query);
            },
            methods: {
                getContent: function () {
                    return {
                        options: {
                            driver: (this.component && this.component.options && this.component.options.driver) || 'postgres',
                            hostname: (this.component && this.component.options && this.component.options.hostname) || 'localhost:2345',
                            database: (this.component && this.component.options && this.component.options.database) || 'database',
                            user: (this.component && this.component.options && this.component.options.user) || '',
                            password: (this.component && this.component.options && this.component.options.password) || '',
                        },
                        params: (this.component && this.component.params) || ['*'],
                        query: (this.component && this.component.query) || 'SELECT $ FROM TABLE',
                    }
                },
                onDriverChange: function (value) {
                    this.$parent.updateAttribute('options', {...this.options, driver: value});
                },
                onHostnameChange: function (value) {
                    this.$parent.updateAttribute('options', {...this.options, hostname: value});
                },
                onDatabaseChange: function (value) {
                    this.$parent.updateAttribute('options', {...this.options, database: value});
                },
                onUserChange: function (value) {
                    this.$parent.updateAttribute('options', {...this.options, user: value});
                },
                onPasswordChange: function (value) {
                    this.$parent.updateAttribute('options', {...this.options, password: value});
                },
                onParamsChange: function (value) {
                    this.params = value;
                    this.$parent.updateAttribute('params', this.params);
                },
                onQueryChange: function (value) {
                    this.query = value;
                    this.$parent.updateAttribute('query', this.query);
                }
            }
        }
    }
};
