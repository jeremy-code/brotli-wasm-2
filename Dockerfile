# syntax=docker/dockerfile:1
FROM ghcr.io/webassembly/wasi-sdk:wasi-sdk-34

ARG BINARYEN_VERSION=133
ARG BROTLI_VERSION=1.2.1
ENV PREFIX=/opt/brotli
ENV WASI_SDK_PATH="/opt/wasi-sdk"
ENV PATH="${WASI_SDK_PATH}/bin:${PATH}"

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends wget; \
    rm -rf /var/lib/apt/lists/

RUN set -eux; \
    wget -q "https://github.com/WebAssembly/binaryen/releases/download/version_${BINARYEN_VERSION}/binaryen-version_${BINARYEN_VERSION}-$(uname -m)-linux.tar.gz" -O /tmp/binaryen.tar.gz; \
    tar -xzf /tmp/binaryen.tar.gz -C /tmp; \
    install -m 0755 "/tmp/binaryen-version_${BINARYEN_VERSION}/bin/wasm-opt" /usr/local/bin/wasm-opt; \
    rm -rf /tmp/binaryen.tar.gz "/tmp/binaryen-version_${BINARYEN_VERSION}"

ADD https://github.com/google/brotli.git#v${BROTLI_VERSION} /tmp/brotli

RUN set -eux; \
    cmake \
        -S /tmp/brotli \
        -B /tmp/brotli/build \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_TOOLCHAIN_FILE="${WASI_SDK_PATH}/share/cmake/wasi-sdk-p1.cmake" \
        -DCMAKE_INSTALL_PREFIX="${PREFIX}" \
        -DCMAKE_C_COMPILER="${WASI_SDK_PATH}/bin/clang" \
        -DCMAKE_AR="${WASI_SDK_PATH}/bin/llvm-ar" \
        -DCMAKE_RANLIB="${WASI_SDK_PATH}/bin/llvm-ranlib" \
        -DBUILD_SHARED_LIBS=OFF \
        -DBROTLI_BUILD_TOOLS=OFF \
        -DBROTLI_DISABLE_TESTS=ON; \
    cmake --build /tmp/brotli/build --parallel; \
    cmake --install /tmp/brotli/build; \
    rm -rf /tmp/brotli

WORKDIR /src
ENTRYPOINT ["/bin/bash"]
