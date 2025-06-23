<script setup>
import { RouterView } from "vue-router";
import LanguageProvider from "./components/language/LanguageProvider.vue";
import LanguageSelector from "./components/language/LanguageSelector.vue";

/*
const { trackEvent } = useEventTracking({
  trackClicks: true,
  trackPageViews: true,
  trackInputs: true,
  autoSetup: true,
});
*/
</script>

<template>
  <!--Wrap the app in a Language context -->
  <LanguageProvider>
    <div id="app">

      <nav>
        <LanguageSelector />
        <!-- Todo make dymanic RouterLinks in the step indicator
           ◯---◍---◍---◍
           so user can see step 1,2... but not fill next step unless previous is filled
      -->
      </nav>

      <main id="app-main">
        <div id="teleport-stepsInForm" class="stepsInForm"></div>
        <div id="LoanSummary-target" class="LoanSummary stickyPosition"></div>

        <form class="form">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </form>
      </main>

    </div>
  </LanguageProvider>
</template>
