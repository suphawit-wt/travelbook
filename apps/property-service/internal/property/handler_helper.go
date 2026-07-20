// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

const (
	maxFileSize  = 10 * 1024 * 1024 // 10MB
	maxFileCount = 10
)

func validateUploadFiles(files []FileMetadataRequest) error {
	if len(files) == 0 {
		return errs.NewBadRequestError("No files provided")
	}

	if len(files) > maxFileCount {
		return errs.NewBadRequestError("Too many files")
	}

	for _, f := range files {
		if f.Size <= 0 {
			return errs.NewBadRequestError("Invalid file size")
		}

		if f.Size > maxFileSize {
			return errs.NewBadRequestError("File too large")
		}
	}

	return nil
}
