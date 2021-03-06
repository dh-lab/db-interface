<template>
  <div class="entities-overview-create">
    <button
      v-if="isUserCanEditThisEntity"
      class="button button--primary"
      @click="saveEntity"
    >
      {{ $t('entities.save') }}
    </button>
    <ApproveButton
      v-if="changeRecord"
      :change-record-id="changeRecord._id"
      :entity-type="model.entityType"
      @success="$router.push({ name: `${model.entityType}-overview` })"
    />
    <RejectButton
      v-if="changeRecord"
      :user-id="changeRecord.user._id"
      :change-record-id="changeRecord._id"
      :entity-type="model.entityType"
      @success="$router.push({ name: `${model.entityType}-overview` })"
    />
    <span
      v-if="changeRecord"
      class="entities-overview-create__changes-author"
    >
      {{ $t('entities.changesAuthor') }}: {{ changeRecord.user.username }}
    </span>
    <div class="entities-overview-create__info-wrapper">
      <component
        :is="infoComponent"
        v-if="entity"
        ref="entityInfo"
        class="entities-overview-create__info"
        :editable="isUserCanEditThisEntity"
        :entity="entity"
      />
    </div>
  </div>
</template>

<script>
  /* eslint-disable new-cap */

  import axios from 'axios';
  import jsonpatch from 'fast-json-patch';
  import notifier from 'codex-notifier';
  import ApproveButton from '../../components/ApproveButton';
  import RejectButton from '../../components/RejectButton';

  export default {
    name: 'EntitiesOverviewSpecific',
    components: {
      RejectButton,
      ApproveButton
    },
    props: {
      model: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        loaded: false,
        entity: null,
        changeRecord: null,
        infoComponent: null
      };
    },
    computed: {
      isUserCanEditThisEntity() {
        if (!this.loaded) return false;

        if (this.$store.state.auth.user.isAdmin) return true;

        return this.changeRecord ? (this.$store.state.auth.user.id === this.changeRecord.user._id) : true;
      }
    },
    async mounted() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        this.infoComponent = (await import('../' + this.model.entityType + '/Info')).default;

        const { changeRecordId } = this.$route.params;

        if (changeRecordId) {
          try {
            this.changeRecord = await axios.get(`/changes/${this.model.entityType}/${changeRecordId}`);
            this.entity = new this.model(jsonpatch.applyPatch(this.changeRecord.entity, this.changeRecord.changeList).newDocument);
          } catch (e) {
            notifier.show({
              message: e.message,
              style: 'error',
              time: 2000
            });

            this.$router.push({
              name: `${this.model.entityType}-overview`
            });

            return;
          }
        } else {
          this.entity = new this.model();
        }
        this.loaded = true;
      },

      async saveEntity() {
        try {
          if (this.$route.params.changeRecordId) {
            await axios.patch(`/changes/${this.model.entityType}/${this.$route.params.changeRecordId}`, { changedEntity: this.entity.data });
          } else {
            this.changesRecord = await axios.post(`/changes/${this.model.entityType}`, { changedEntity: this.entity.data });
            this.$router.push({
              name: `${this.model.entityType}-create`,
              params: {
                changeRecordId: this.changesRecord._id
              }
            });
          }
          notifier.show({
            message: this.$t('notifications.savedSuccessfully'),
            time: 2000
          });
        } catch (e) {
          notifier.show({
            message: e.message,
            style: 'error',
            time: 2000
          });
        }
      }
    }
  };
</script>

<style>
  .entities-overview-create {

    .button {
      margin-left: 5px;
    }

    &__changes-author {
      float: right;
    }

    &__info-wrapper {
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
    }

    &__info {
      width: 400px;
    }
  }
</style>
