#!/usr/bin/env bash

if [ ! -f token.local ] && [ -z $1 ]
then
  echo "usage: test-config.sh [CIRCLE_TOKEN]"
  echo
  echo "Must specify a token in argument or in token.local file."
else
  curl --user "${CIRCLE_USER:-"$(cat token.local 2> /dev/null)"}:" \
      --request POST \
      --form revision=$(git rev-parse HEAD)\
      --form config=@config.yml \
      --form notify=false \
          https://circleci.com/api/v1.1/project/github/AlexanderOtavka/ride-along/tree/master
fi
