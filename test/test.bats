#!/usr/bin/env bats


# just testing
@test "just do anything that passes" {
  run which echo
  [ "$status" -eq 0 ]
}
