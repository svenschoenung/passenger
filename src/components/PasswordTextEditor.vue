
 <template>
  <div class="password-text-editor">
    <div class="row label-row">
      <div class="col col-1"></div>
      <div class="col col-10">
        <label>Password:</label>
      </div>
      <div class="col col-1">
      </div>
    </div>
    <div class="row input-row">
      <div class="col col-1"></div>
      <div class="col col-10">
        <password-input :value="contents.password" @input="setPassword"/> 
      </div>
      <div class="col col-1"></div>
    </div>
    <div class="row label-row">
      <div class="col col-1"></div>
      <div class="col col-6">
        <label>Custom text:</label>
      </div>
      <div class="col col-1">
      </div>
    </div>
    <div class="row input-row flex direction-column flex-grow">
      <div class="col col-1"></div>
      <div class="col col-10 flex direction-column flex-grow">
        <q-input dense outlined 
              type="textarea" class="bg-1 flex direction-column flex-grow" :debounce="500"
              :value="contents.text" @input="setText" />
      </div>
      <div class="col col-1"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import electron from 'electron';

import { PathValidator } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';
import { parseTextContents, PasswordTextContents, serializeTextContents } from '@/service/contents';
import icons from '@/ui/icons';

@Component({})
export default class PasswordTextEditor extends Vue {
  @Prop({ type: String }) value!: string
  contents: PasswordTextContents | null = null

  created() {
    setNonReactiveProps(this, { icons })
    this.contents = parseTextContents(this.value)
  }

  setPassword(password: string) {
    this.contents!.password = password
    this.updateContents()
  }

  setText(text: string) {
    this.contents!.text = text
    this.updateContents()
  }

  @Emit('input')
  updateContents() {
    return serializeTextContents(this.contents!);
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
@import "src/styles/style.mixins.scss";
.password-text-editor {
  flex-wrap: nowrap;

  > .row {
    align-items: center;
  }

  .label-row {
    height: 35px;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  .q-textarea * {
    display: flex;
    flex-direction: column;
    flex-grow: 1
  }

  textarea {
      resize: none !important;
      @include styled-scrollbar
  }
}
</style>