<template>
    <!--https://github.com/SyedWasiHaider/vue-highlightable-input-->
    <highlightable-input
            v-b-tooltip.html.hover :title="tooltipContent"
            caseSensitive
            id="id-highlightable-input"
            :value="text"
            fireOn="input"
            @input="onChange"
            :highlightDelay="100"
            :highlight="highlightRegex"
            :data-placeholder="placeholder"
            class="text-input carabina-text mt-2 px-1 highlightable-input-class"
            highlight-style="color: var(--carabina-theme-color); font-style: italic;"
            trim>
    </highlightable-input>
</template>
<script>
    import Vue from 'vue';
    import '@/styles/texts.css';
    import {mapGetters} from 'vuex';
    import HighlightableInput from 'vue-highlightable-input'

    export default Vue.extend({
        name: 'StackerHighlightableInput',
        components: {
            HighlightableInput
        },
        props: ['highlightableRegex', 'value', 'placeholder', 'emptyValue', 'password', 'disableHighlight'],
        data() {
            const highlightRegex = [
                {
                    text: /({{[^}}]+}})|(<<[^>>]+>>)/g,
                    style: 'color: var(--carabina-theme-color); font-style: italic;'
                }
            ];
            if (this.highlightableRegex) {
                highlightRegex.push({
                    text: this.highlightableRegex,
                    style: 'color: var(--carabina-text-color); font-style: italic;'
                });
            }
            const text = typeof this.value !== 'string' ? this.value.toString() : this.value;
            return {
                text: text,
                highlightRegex: this.disableHighlight ? [{text: /a^/g}] : highlightRegex,
            }
        },
        watch: {
            value: function () {
                this.text = typeof this.value !== 'string' ? this.value.toString() : this.value;
            },
            placeholder: function () {
                this.text = typeof this.value !== 'string' ? this.value.toString() : this.value;
            }
        },
        computed: {
            ...mapGetters('nav-bar', ['selectedEnvironment']),
            tooltipContent: function () {
                const defaultHighlight = this.highlightRegex[0];
                if (defaultHighlight) {
                    const variableRegex = defaultHighlight.text;
                    const store = this.selectedEnvironment.store || {};
                    let flagReplacement = false;

                    const htmlTag = '<div style="color: var(--carabina-text-color);">' + this.text.replace(variableRegex, (item) => {
                        const itemName = item.substr(2, item.length - 4);
                        const storeElement = store[itemName];
                        if (storeElement) {
                            flagReplacement = true;
                            return storeElement;
                        }
                        return item;
                    }) + '</div>';

                    return flagReplacement ? htmlTag : '';
                }
                return '';
            },
        },
        methods: {
            onChange: function (value) {
                if (this.text !== value) {
                    this.text = value;
                    if (value === '' && this.emptyValue) {
                        this.text = this.emptyValue;
                    }
                    this.$emit('input', this.text);
                }
            },
        },
    });
</script>
<style type="text/css">

    [data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: var(--carabina-text-darker-color);
        filter: brightness(0.5);
    }

    .highlightable-input-class {
        white-space: nowrap;
        overflow: hidden;
    }

    .highlightable-input-class br {
        display: none
    }

</style>
