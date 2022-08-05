#! /bin/bash


output=0
yarn_took=0

while read -r line; do
    if [[ $(echo $line | rg "Done") ]]; then

    else
        num="${line##*(}"
        real_num="${num%%ms)}"
        output=$(bc <<< "$output + $real_num" )
    fi
done < swc_local_metric

echo "real num: ${output}ms"


