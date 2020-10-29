
destdir="../../src/data/specs"
index="$destdir/index.js"

cat << EOF > "$index"
"use strict"
/**
 * All Avalanche API Methods
 * */
module.exports = {
EOF


for doc in avalanche-docs/docs/v1.0/en/api/*.md; do
  spec=$(node parser.js "$doc")
  if [ ! "$spec" ]; then
    continue
  fi;

  srcfile="${doc##*/}"
  api="${srcfile%.md}"
  destfile="$api.json"
  echo "$spec" > "$destdir/$destfile";
  echo "  ${api}: require(\"./${api}\")," >> "$index"
done

echo "}" >> "$index"
