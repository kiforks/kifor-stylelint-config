import compareVersions from 'src/js/workflow/compare-versions.cjs';

const [version1, version2] = process.argv.slice(2);

console.log(compareVersions(version1, version2));
