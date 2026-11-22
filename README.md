# 《放开那个女巫》灰堡舆图

交互舆图收录 90 处主要地点、四国水系和后期沃土铁路。可按地区和别名查找地点，点选地标查看原文章节。铁路图层提供三段铺轨进度。

## Windows 本地打开

1. 下载 [graycastle-atlas-windows.zip](https://github.com/PatrickZhu0/release-that-witch-atlas/raw/refs/heads/main/graycastle-atlas-windows.zip)，解压到普通文件夹。
2. 双击 `start-atlas.cmd`。它会启动本机地图并打开默认浏览器。Windows x64 安装包内附运行所需组件。
3. 使用完毕后关闭启动窗口。网页右上角的「打开 Azgaar 编辑器」可载入现成工程。

`dist/later-railway.svg` 可以直接用浏览器打开。`dist/release-that-witch.map` 可在 Azgaar 中另行导入。macOS 和 Linux 上有 Python 3 时，可在解压目录运行 `python3 scripts/serve-atlas.py`。

## 地图依据

底图按二目小说叙述绘制。四国政区采用争王令初期格局，另叠加后期地点、工程及古代遗址。地名手记附有原文章节。坐标与线路是相对方位示意。

编辑器为 [Azgaar Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) 1.158.0，MIT 许可见包内 `dist/editor/LICENSE`。Windows x64 包内 Python 的许可见 `runtime/LICENSE.txt`。

