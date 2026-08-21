import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("contains the complete Closetly product shell", async () => {
  const [app, onboarding, navigation] = await Promise.all([
    readFile(new URL("../components/WardrobeApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/onboarding/OnboardingModal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/layout/AppNavigation.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(onboarding, /Your clothes\./);
  assert.match(onboarding, /More possibilities\./);
  assert.match(onboarding, /Explore the demo wardrobe/);
  assert.match(navigation, /Wardrobe/);
  assert.match(navigation, /Create Outfit/);
  assert.match(app, /AddItemModal/);
  assert.match(app, /SavedLooksScreen/);
  assert.doesNotMatch(`${app}${onboarding}${navigation}`, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("ships production metadata and removes starter artifacts", async () => {
  const [page, layout, packageJson, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<WardrobeApp \/>/);
  assert.match(layout, /Closetly — Style What You Own/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "WARDROBE_IMAGES"/);
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
