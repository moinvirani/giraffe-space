// Xcode 26.4 (Apple clang 21) rejects the consteval format-string checks in the
// fmt 11.0.2 that React Native 0.79 (Expo SDK 53) vendors via RCT-Folly:
//   "call to consteval function 'fmt::basic_format_string<...>' is not a constant expression"
// Compiling only the fmt pod as C++17 skips that code path (consteval is C++20).
// Upstream fix (fmt 12.1) ships in React Native >= 0.83 / Expo SDK 56; drop this then.
// See https://github.com/fmtlib/fmt/issues/4740
const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MARKER = "# withFmtCxx17: compile fmt as C++17 (Xcode 26.4 consteval fix)";
const SNIPPET = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      next unless target.name == 'fmt'
      target.build_configurations.each do |build_config|
        build_config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
`;

module.exports = function withFmtCxx17(config) {
  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      const src = fs.readFileSync(podfile, "utf8");
      if (src.includes(MARKER)) return cfg;

      // Insert right after react_native_post_install(...) so RN can't reset it.
      const rnPostInstall = /react_native_post_install\([\s\S]*?\n\s*\)\n/;
      if (!rnPostInstall.test(src)) {
        throw new Error("withFmtCxx17: react_native_post_install(...) not found in Podfile");
      }
      fs.writeFileSync(podfile, src.replace(rnPostInstall, (m) => m + SNIPPET));
      return cfg;
    },
  ]);
};
