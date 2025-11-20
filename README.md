# 連中に反省を促すアプリ
**反省点実行補助タスク管理アプリ**
[こちら](https://hou-rai3.github.io/robot-club-tasks/)使用できる。

[![Demo](https://img.shields.io/badge/Demo-Live%20App-crimson?style=for-the-badge&logo=github)](https://hou-rai3.github.io/robot-club-tasks/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Built%20With-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

<p align="center">
  <img width="100%" alt="App Top" src="https://github.com/user-attachments/assets/a5d42670-064f-4186-9d03-69d1aa8ec5ff" />
</p>

## 概要
私が所属している「大阪公大高専 ろぼっと倶楽部」の活動における「反省」と「課題」を効率的に管理し、次回の活動へ確実に繋げるためのWebアプリケーションである。

---

## 開発の背景

### 課題：議論の流出
我々の部活では、大会後や節目に必ず「反省会」を実施している。しかし、そこで挙がった貴重な課題や改善案が：
* ホワイトボードや個人のメモに留まる
* 「誰が・いつまでに・やるべきか」が曖昧になる
* 結果として、議論した内容が流れてしまい、同じ失敗を繰り返す

という深刻な問題があった。

### 解決策：エンジニアのための専用ツール
汎用的なToDoアプリでは「部活特有の熱量」や「チームごとの管理」が合致せず、定着しなかった。そこで、**「反省会で出た課題を確実に記録し、エンジニアとしての改善サイクルを回す」** ことに特化した専用ツールを開発した。

---

## 主な機能

### 1. 直感的な課題管理 (Drag & Drop)
`dnd-kit` を採用し、付箋を貼り替えるような感覚でタスクの状態（未着手〜完了）を管理できる。
ドラッグアンドドロップによるステータスの変更はもちろん、他班や他のメンバーへのタスク移動も直感的に実行可能である。

<p align="center">
  <img width="100%" alt="Drag and Drop" src="https://github.com/user-attachments/assets/f3c482e4-5fce-41fd-99f5-93977fc5be36" />
</p>

### 2. マルチビューによる視点の切り替え
状況に応じて、最適な粒度でタスクを確認できる。
* **全体一覧:** チーム全体の総意と進捗を確認
* **班別:** メカ・回路・制御ごとのタスクを深掘り
* **メンバー別:** 個人の負荷状況を可視化

<p align="center">
  <img width="100%" alt="Multi View" src="https://github.com/user-attachments/assets/5395e96e-4d00-48e6-bf48-f1f3de2df2a5" />
</p>

### 3. 没入感を高めるUIデザイン
事務的な管理画面ではなく、かっこいい「ダークグレー × クリムゾンレッド」のデザインを採用した。部活動のモチベーションを高めるUIに仕上げている。

<p align="center">
  <img width="100%" alt="UI Design" src="https://github.com/user-attachments/assets/095aed61-7c0b-450d-b36a-7220a2497297" />
</p>

### 4. タスク詳細の管理
タスクをクリックすることで、具体的な内容を記述・確認可能である。いつでも編集でき、情報のアップデートに対応する。

<p align="center">
  <img width="300" alt="Task Details" src="https://github.com/user-attachments/assets/6b4967f8-703f-4632-a96a-fb6c5c6ac7f7" />
</p>

---

## こだわり・工夫した点

### ユーザー体験 (UX) への配慮
* **「反省」をポジティブに:**
    「反省＝ネガティブ」という印象を払拭するため、デザインをスタイリッシュに統一した。「課題の消化」をゲームやRPGにおける「機体のアップグレード」のようにポジティブに捉えられるよう意識した。
* **情報のスキャン性:**
    カード型UIとグリッドレイアウト（auto-fit）を採用し、PC画面では横幅いっぱいに情報を展開した。一目で多くのタスクを把握できる一覧性を確保している。

### 技術的な挑戦
* **dnd-kit の高度な活用:**
    単なるリストの並び替えではなく、グリッドレイアウト（`rectSortingStrategy`）上での直感的な操作性を実現するため、Reactコンポーネントの設計とCSSの整合性に注力した。
* **シームレスなレスポンシブ:**
    スマートフォンではリスト表示、PCではグリッド表示へとシームレスに切り替わるよう、CSS GridとMedia Queryを駆使して実装した。

### 遊び心
* **ユーモアの導入:**
    堅苦しさを排除するため、ユニークなGIFアニメーションを差し込んでいる。ネットミームをオマージュしたタイトルなど、部活の雰囲気を保ちつつ、メンバーが拒否感なく「楽しくタスクを消化できる」空気感を作った。

<p align="center">
  <img width="200" alt="Fun Element" src="https://github.com/user-attachments/assets/e138bb56-67d6-4ca2-afd7-899cc15aff1f" />
</p>

---

## 使用技術

| Category | Tech Stack |
| --- | --- |
| **Frontend** | React |
| **Library** | @dnd-kit/core, @dnd-kit/sortable |
| **Styling** | Standard CSS (Modern CSS Variables, CSS Grid) |
| **Hosting** | GitHub Pages |

---

## 開発期間

* **期間:** 2025.10.23 ~ 2025.11.20
* **工数:** 約 23 時間（設計・実装・検証・デプロイ含む）

---

## License

This project is licensed under the MIT License.
