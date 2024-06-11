{ pkgs }: {
    deps = [
      pkgs.zip
      pkgs.unzip
        pkgs.nodejs-16_x
        pkgs.cowsay
    ];
}