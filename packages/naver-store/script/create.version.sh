echo "{" >> bundle/version.json
cat package.json | grep '"version":' >> bundle/version.json
echo "\"hash\": \"$(git rev-parse HEAD)\"" >> bundle/version.json
echo "}" >> bundle/version.json