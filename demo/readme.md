### mac 下安装 dmg 安装之后打开提示文件损坏

输入以下命令

```bash
sudo xattr -d com.apple.quarantine /Applications/demo.app
```

> 本项目的安装包名为 `demo`，所以命令中的 `demo.app` 需要替换为你实际的安装包名称。

参考来源：
- https://blog.csdn.net/xiaomogg/article/details/135985124
- https://zhuanlan.zhihu.com/p/135948430
