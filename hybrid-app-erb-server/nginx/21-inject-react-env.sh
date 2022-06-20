#! /usr/bin/env bash

echo "inject react variables"

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in $JSFOLDER;
do
  cat $file | envsubst $EXISTING_VARS | tee $file.tmp && mv $file.tmp $file
done
