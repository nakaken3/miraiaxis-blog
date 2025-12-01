---
title: "Windows10マシンは捨てちゃダメ！華麗にWindows11マシンに変身させる裏技（後編）"
date: 2025-11-30T08:10:05+09:00
draft: false
summary: "サポートが切れるWindows10マシンを、華麗にWindows11マシンに変身させる裏技（後編）"
tags:
  [
    "Linux",
    "Windows10",
    "Windows11",
    "裏技",
    "サポート切れ",
    "OS移行",
    "仮想化",
    "アップグレード",
  ]
categories: ["Linux"]
---

さて、linux のインストールうまくいきました。

いよいよラストスパート。仮想環境の構築です。

仮想化は Virtualbox というアプリを使います。

無料で誰でも使用できます。

この Virtualbox 上で Windows を起動させ、Windows11 にアップグレードしたら作業は完了です。

---

## 🛠️ 手順 3 　 仮想環境を構築する

LinuxMint を立ち上ると Windows のように左下にメニューが表示されるアイコンがあります。

それをクリックして、「Xfce 端末 端末エミュレーター」というのを起動してください。

そこに次のコマンドを打ち込んでください。

コピペでも OK。

1.  # VirtualBox を入れる（Mint/Ubuntu 系）

        sudo apt update
        sudo apt install -y virtualbox dkms build-essential linux-headers-$(uname -r)
        sudo usermod -aG vboxusers $USER

    → 一度**ログアウト → ログイン**（グループ反映のため）。

    途中でパスワード入力を求められます。

    インストールの時に設定したパスワードを入力してください。

2.  # 外付け SSD を挿す（自動マウント確認）

    ファイルマネージャで「デバイス」に表示されるはずです。パス例：`/media/<あなたのユーザー名>/<SSD名>/Win10.vhdx`

    > exFAT/NTFS の SSD なら追加で入れておくと安心：

        sudo apt install -y exfat-fuse exfatprogs ntfs-3g

3.  # VHDX→VDI へ変換

    そのまま VHDX でも起動しますが、**VDI の方が軽くて後で圧縮しやすい**です。

        VBoxManage clonemedium disk "入力.vhdx" "出力.vdi" --format VDI

    - `VBoxManage clonemedium disk`：仮想ディスクを複製（形式変換も可）
    - `"入力.vhdx"`：元のディスク（読み取り）
    - `"出力.vdi"`：作る先（書き込み）
    - `--format VDI`：出力形式を VDI に指定（**動的割り当て**が既定）

4.  # VM を作成して既存ディスクをつなぐ

    ここまでくると、Linux のメニューに Virtualbox が表示されていると思います。

    Virtualbox を選択して起動します。

    1.  VirtualBox →「新規」

        - 名前：`Win10P2V`（任意）
        - タイプ：**Windows**／バージョン：**Windows 10 (64-bit)**
        - メモリ：**4096MB**（4GB 以上を推奨）
        - 仮想ディスク：**既存の仮想ディスクを使用** → 上の作業で変換した VDI ファイルを指定。

    2.  設定 →**システム**

        - チップセット：**ICH9**
        - **I/O APIC 有効**
        - **（元 PC が UEFI なら）EFI を有効化**、MBR ならオフ

    3.  設定 →**ストレージ**

        - コントローラは **SATA(AHCI)** に、ディスクが接続されていることを確認

    4.  設定 →**ディスプレイ**

        - VRAM 64MB、**3D アクセラレーションは最初オフ**

    5.  設定 →**ネットワーク**：NAT（後で変更可）

5)  # 初回起動 → 仕上げ

    1. 起動すると Windows が**ドライバ再検出**で数回再起動することがあります。
    2. VirtualBox メニュー「デバイス」→**Guest Additions CD イメージの挿入**→ `VBoxWindowsAdditions.exe` を実行 → 再起動。
    3. 解像度・マウス統合・クリップボード共有が快適になります。

6)  # つまずいたらここをチェック

    - **ブート失敗**：

      - 物理が UEFI なら**EFI 有効**になっているか
      - ストレージが**SATA(AHCI)** で接続されているか
      - **青画面/自動修復**：回復環境で**スタートアップ修復**。ダメならもう一方の 96MB EFI を含めて VHDX 作り直し（最終手段）。

      - **表示が荒い/解像度固定**：Guest Additions 入れ直し、**VMSVGA**コントローラにしているか確認。

      - **重い**：メモリ 2GB→1.5GB に下げる、不要サービス停止、外付け SSD が**USB3**でつながっているか確認。

    - **KVM 問題**：

      > **VirtualBox can't operate in VMX root mode … (VERR_VMX_IN_VMX_ROOT_MODE)**

      仮想マシンを起動するときこのようなエラーメッセージが出る時があります。

      Linux 側で **KVM** が VT-x（または AMD-V）を先に掴んでいて、VirtualBox が使えない状態です。

      → **KVM を外してから** VirtualBox を起動すれば OK。

          # 1) KVMが動いているか確認
          lsmod | grep -E 'kvm|vbox'

          # 2) 使っていそうなら一旦止める（libvirt等を使っていれば停止）
          sudo systemctl stop libvirtd 2>/dev/null || true

          # 3) KVMモジュールをアンロード（Intelの場合）
          sudo modprobe -r kvm_intel
          sudo modprobe -r kvm

          # AMDのときはこちら
          # sudo modprobe -r kvm_amd
          # sudo modprobe -r kvm

          # 4) VirtualBoxのモジュールを準備
          sudo /sbin/vboxconfig 2>/dev/null || sudo modprobe vboxdrv

          # 5) 念のため確認
          lsmod | grep -E 'kvm|vbox'

      そのまま **VirtualBox で VM を起動**してみてください。

      ***

      ## 再発防止（再起動後に KVM が勝手に有効化されるのを防ぐ）

      KVM を使う予定がないなら **ブラックリスト**化しておくと楽です（Intel の場合）。

           echo -e "blacklist kvm\nblacklist kvm_intel" | sudo tee /etc/modprobe.d/blacklist-kvm.conf
           # AMDなら
           # echo -e "blacklist kvm\nblacklist kvm_amd" | sudo tee /etc/modprobe.d/blacklist-kvm.conf

      ※将来 GNOME Boxes / KVM を使いたくなったら、このファイルを削除して再起動すれば戻せます。

---

## これで作業完了です

新規で作成した仮想マシンを起動してください。

Windows11 にアップグレードできなかった問題がクリアになった状態の仮想マシンです。

起動させた後は Windows11 へアップグレードしてみてください。
