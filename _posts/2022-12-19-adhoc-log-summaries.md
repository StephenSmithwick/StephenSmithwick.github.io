---
layout: post
title:  "Adhoc Log Summaries in Unix"
date:   2022-12-19
categories: devops
---

The Unix CLI famously provides simple singularly focussed tools which acheive powerful results when combined with the pipe command. Below I explore how we can summarize our logs using common unix tools. While performance can vary by machine and tool version, I have found these tools to generally work well with up to 100s of GB of logs. I recomend to use a smaller sample of your logs while initially building your query (`head -n 1000` is your friend).

## The Setup
For the following examples I will simulate logs with the following zsh command:
```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}")
```

Outputting:
```logs
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

## The basics: `grep`, `sort`, `cut` and `uniq`
A good first approach to count requests is to use the following commmands: 
- `grep` \ `egrep` to focus our results on a particular pattern in regex
- `cut`  to select log parts of well structured logs
- `sort` to sort output for use by uniq and to sort the final results by frequency
- `uniq` to group uniq results

We can grab the interesting log part of well structured logs using `cut` with the proper delimtter.  Then pipe the results to `sort` and `uniq -c` to count the frequency of unique log parts.  At the end, we can re-sort the results by most frequent `sort -nr`:

```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
| cut -d ';' -f 2 \
| sort \
| uniq -c \
| sort -nr
```
```logs
      3 GET D
      3 GET C
      2 GET B
      1 GET A
```

When the logs are less structured or the structure isn't yet known by the operator, using `grep -o` with a regular expression matching the interesting part of the log message will work similarly:
```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
| grep -Eo "GET [^;]+" \
| sort \
| uniq -c \
| sort -nr
```
```logs
      3 GET D
      3 GET C
      2 GET B
      1 GET A
```

## Stream editing using `awk`
Awk, while slightly more complex, allows us to do much more complicated log analysis. Here we summarize our logs with the average duration parsed from every request:

```zsh
(for req in A_100 B_500 C_100 D_200 B_10 C_8 C_8 D_200 D_200
    echo "$(date -Ins); GET ${req:s/_/; duration=}") \
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

```logs
255  GET B
200  GET D
100  GET A
38.6667  GET C
```

## Stream editing using `perl`
While Perl is not in the posix list, sometimes we need better regular expression handling than `awk` provides. Perl can behave as a stream editor and with the right flags and it's syntax can be like `awk`:

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