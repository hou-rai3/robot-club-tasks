# 連中に反省を促すアプリ
私が所属している大阪公大高専 ろぼっと倶楽部の活動における「反省」と「課題」を効率的に管理し、次回の活動へ確実に繋げるためのWebアプリケーションである。
<img width="1030" height="746" alt="image" src="https://github.com/user-attachments/assets/a5d42670-064f-4186-9d03-69d1aa8ec5ff" />


# [こちら](https://hou-rai3.github.io/robot-club-tasks/)からご利用できます。


# 開発の背景と着想

我々の部活では、ロボコンなどの大会後や定期的な活動の節目に必ず「反省会」を実施している。しかし、これまで反省会で挙がった課題や改善案はホワイトボードや個人のメモに留まることが多く、「誰が・いつまでに・やるべきか」が曖昧になり、議論した内容が流れてしまうという深刻な問題があった。

汎用的なToDoアプリでは「部活特有の熱量」や「チームごとの管理」がしっくりこず、定着しなかった経験から、反省会で出た課題を確実に記録し、エンジニアとしての改善サイクルを回すための専用管理ツールが必要であると考え、本アプリを開発した。

# 主な機能とスクリーンショット

1. 直感的な課題管理 (Drag & Drop)

dnd-kit を採用し、付箋を貼り替えるような感覚でタスクの状態（未着手〜完了）を管理できる。
<img width="1007" height="387" alt="image" src="https://github.com/user-attachments/assets/16852ecb-56c5-4aa7-85ea-5cf990ead3fe" />

2. マルチビューによる視点の切り替え

「全体一覧」でチームの総意を確認し、「班別」でメカ・回路・制御ごとのタスクを深掘りし、「メンバー別」で個人の負荷状況を可視化する。状況に応じた視点の切り替えが可能。

<img width="1120" height="653" alt="image" src="https://github.com/user-attachments/assets/5395e96e-4d00-48e6-bf48-f1f3de2df2a5" />

3. 没入感を高めるUIデザイン

部活動のモチベーションを高めるため、事務的な管理画面ではなく、かっこいい「ダークグレー × クリムゾンレッド」のデザインを採用した。

<img width="1061" height="411" alt="image" src="https://github.com/user-attachments/assets/095aed61-7c0b-450d-b36a-7220a2497297" />

# こだわり・工夫した点

・ユーザー体験 (UX) への配慮

「反省」をネガティブにしない: デザインをブラックとクリムゾンレッドを使い、かっこよくにすることで、「課題の消化」を「機体のアップグレード」のようにポジティブに捉えられるよう意識した。

情報のスキャン性: カード型のUIを採用しつつ、PC画面ではグリッドレイアウト（auto-fit）で横幅いっぱいに情報を展開し、一目で多くのタスクを把握できるようにした。

・技術的な挑戦

dnd-kit の活用: 一般的なリストの並び替えだけでなく、グリッドレイアウト（rectSortingStrategy）での直感的な操作性を実現するために、Reactコンポーネントの設計とCSSの整合性に注力した。

・レスポンシブ対応: スマートフォンでの閲覧時はリスト表示、PCではグリッド表示へとシームレスに切り替わるよう、CSS GridとMedia Queryを駆使して実装した。

・遊び心
堅苦しいものだけでなく、ユニークなGIFを差し込むことで楽しくタスクを消化できる。

![20251120-0038-30 4203059](https://github.com/user-attachments/assets/91ba1a4e-548e-44ce-9d64-c2eb4f7cea08)


# 使用技術

Frontend: React

Drag & Drop: @dnd-kit/core, @dnd-kit/sortable

Styling: Standard CSS (Modern CSS Variables, CSS Grid)

Hosting: GitHub Pages

# 開発期間 (必須)

開発期間: 2025.10.23 ~ 2025.11.20
取り組み時間: 約 23 時間（設計・実装・検証・デプロイ含む）

# License

This project is licensed under the MIT License.
