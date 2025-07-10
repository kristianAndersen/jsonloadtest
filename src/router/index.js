


// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DynamicView from '../views/DynamicView.vue'

// Create basic router with placeholder routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root', // Add a name to the root route
      component: DynamicView,
    }
  ]
})

// update routes with data from store a route for each step
// router/index.js
export function updateRoutes(storeData) {
  console.log('Updating routes with store data:', storeData);
  // First, remove all existing routes
  router.getRoutes().forEach(route => {
    if (route.name) {
      router.removeRoute(route.name);
    }
  });

  const firstStepPath = `/step1`;

  const routes = [
    {
      path: '/',
      name: 'root',
      redirect: firstStepPath // Redirect to first step
    }
  ];

  // Add routes dynamically
  Object.entries(storeData.steps).forEach(([stepId, step]) => {
    console.log("THE STEPS" + step.properties?.label)
    routes.push({
      path: `/step${step.properties?.label}`,
      name: `${step.properties?.label}`,
      component: DynamicView,
      props: { stepId: stepId },
      meta: { step: 'FormAssembly' },
      step: `/step${step.properties?.label}`,
    });
  });

  // Add catch-all route at the end
  routes.push({
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: firstStepPath
  });

  // Add all routes to router
  routes.forEach(route => {
    router.addRoute(route);
    console.log('Added route:', route);
  });

  return router;
}
router.beforeEach((to, from, next) => {
  console.log(`Navigation attempt: ${from.path} -> ${to.path}`);
  next();
});

export default router;
