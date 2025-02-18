---
layout: post
title:  "Adhoc Log Summaries in Unix"
date:   2022-12-19
categories: devops
---

The Unix command-line interface (CLI) is known for its simple commands that achieve powerful results in combination.

Below, I explore how we can summarize logs using common Unix commands.

While performance can vary by machine and tool version, I have found these tools to generally work well with logs hundreds of gigabytes in size. When building a query, I recommend working with a smaller sample of your logs first (`head -n 1000` is your friend).

## The Setup
For the following examples, I will simulate logs using this Zsh command:
```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}")
```

Outputting:
```
2022-12-19T23:44:33,357606000-08:00; GET A; duration=100
2022-12-19T23:44:33,364918000-08:00; GET B; duration=500
2022-12-19T23:44:33,372200000-08:00; GET C; duration=100
2022-12-19T23:44:33,379211000-08:00; GET D; duration=200
2022-12-19T23:44:33,386160000-08:00; GET B; duration=10
2022-12-19T23:44:33,393175000-08:00; GET C; duration=8
2022-12-19T23:44:33,399998000-08:00; GET C; duration=8
2022-12-19T23:44:33,406752000-08:00; GET D; duration=200
2022-12-19T23:44:33,413488000-08:00; GET D; duration=200
```

## The Basics: `grep`, `sort`, `cut` and `uniq`
A good first approach to count requests is to use the following commmands:
- `grep` / `egrep` to filter logs based on a regular expression
- `cut`  to extract structured log parts
- `sort` to sort output for use by uniq and to sort the final results by frequency
- `uniq` to group uniq results

For well-structured logs, `cut` can extract relevant log parts. We then pipe the output through `sort` and `uniq -c` to calculate the frequency, followed by `sort -nr` to sort results in descending order:
```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
| cut -d ';' -f 2 \
| sort \
| uniq -c \
| sort -nr
```
```
      3 GET D
      3 GET C
      2 GET B
      1 GET A
```

If logs are less structured or their format is unknown, grep -o can extract relevant information using a regular expression:
```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
| grep -Eo "GET [^;]+" \
| sort \
| uniq -c \
| sort -nr
```

This produces the same result:
```
      3 GET D
      3 GET C
      2 GET B
      1 GET A
```

## Stream editing using `awk`
`awk`, while slightly more complex, allows for more advanced log analysis. Here, we compute the average request duration per request type

```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(gdate -Ins); GET ${req:s/_/; duration=}") \
| awk -F '[;=]' '
    /GET .*/ {
        duration[$2]+= $4
        count[$2]++
    }
    END {
        for (req in count)
            print (duration[req] / count[req]), req
    }' \
| sort -nr
```

```
255  GET B
200  GET D
100  GET A
38.6667  GET C
```

## Stream editing using `perl`
Although Perl is not part of the POSIX standard, it provides more advanced regular expression handling than `awk` and also functions as a stream editor with the correct flags:

```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
| perl -lane '
    BEGIN { my ($durations, $counts) }
    /(GET [^ ]+); duration=(\d+)/ and do {
        $durations{$1} += $2;
        $counts{$1} += 1;
    };
    END {
        while (my ($req,$count)=each %counts) {
            $avg=$durations{$req}/$count;
            print "$avg $req";
        }
    }' \
| sort -nr
```

```
255 GET B
200 GET D
100 GET A
38.6666666666667 GET C
```
