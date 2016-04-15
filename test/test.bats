#!/usr/bin/env bats


# just testing
@test "just do anything that passes" {
  run which kbox
  [ "$status" -eq 0 ]
}
