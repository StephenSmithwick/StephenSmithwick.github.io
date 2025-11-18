### How to Use

<details markdown="block">
<summary>Instructions for decorating leetcode lists with logged-in user data.
    <button type="button" onclick="window.open('https://leetcode.com/accounts/login','_blank')">LeetCode Login</button>
</summary>

Install this user script to enhance the lists below: [**blog.leetcode.user.js**]({{ site.playground_urls.raw }}/user-scripts/blog.leetcode.user.js)

The user script will request access to a LeetCode URL to fetch your logged-in user's problem data.
{:.information}
LeetCode Problem Data: [https://leetcode.com/api/problems/algorithms/](https://leetcode.com/api/problems/algorithms/)

To generate more lists of `problem` `slugs`, use this JavaScript query in your browser's developer console from any page containing links to LeetCode problems:
```javascript
[...document.querySelectorAll('a')]
    .map(       li => li.href.match(/\/problems\/([^\/]+)\//))
    .filter(    match => match)
    .map(       match => match[1])
```

More user scripts at: [UserScripts]({% post_url 2024-02-10-User-Scripts %})
</details>
