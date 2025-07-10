<template>
  <Basefieldset class="details" :class="{ 'is-open': open }">
    <!--v-if-->
    <div role="summary" class="summary general-width is-open">
      <div class="summaryWrap show-summary hide-summary">
        <input type="checkbox" id="vehicle1" name="vehicle1" tabindex="1" value="Bike" />
        <span class="summary_headline terms is-open">
          Consent to Receive Marketing Communications ...
        </span>
      </div>
    </div>
    <div role="definition" class="content" style="transition: height 400ms ease-in-out">
      <div class="innerContent">
        The Service Provider (Sambla Group Oy) is authorized to send me email
        and SMS about topical information and offers regarding the products and
        services of the Service Provider and its cooperating partners. The
        Service Provider (Sambla Group Oy) is authorized to send me email and
        SMS about topical information and offers regarding the products and
        services of the Service Provider and its cooperating partners. The
        Service Provider (Sambla Group Oy) is authorized to send me email and
        SMS about topical information and offers regarding the products and
        services of the Service Provider and its cooperating partners.
      </div>
    </div>
  </Basefieldset>
</template>

<script setup>
import { ref } from "vue";
import Basefieldset from "../../Base/containers/Basefieldset.vue";
const open = ref(false);
</script>
