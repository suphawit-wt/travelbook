// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package imageutil

import (
	"bytes"
	"fmt"
	"image"
	"image/png"
	"mime/multipart"

	"github.com/disintegration/imaging"
)

// ProcessAvatarImage opens, crops, resizes, and encodes an uploaded multipart image into PNG format buffer.
func ProcessAvatarImage(fileHeader *multipart.FileHeader, size int) (*bytes.Buffer, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer func() {
		_ = file.Close()
	}()

	img, _, err := image.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("invalid image file: %w", err)
	}

	imgCroppedResize := imaging.Fill(img, size, size, imaging.Center, imaging.Lanczos)

	buf := new(bytes.Buffer)

	err = imaging.Encode(
		buf,
		imgCroppedResize,
		imaging.PNG,
		imaging.PNGCompressionLevel(png.BestCompression),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to encode image: %w", err)
	}

	return buf, nil
}
