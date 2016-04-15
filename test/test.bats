#!/usr/bin/env bats


# just testing
@test "just do anything that passes" {
  run which echo
  [ "$status" -eq 0 ]
}

# just testing
@test "check if kbox works" {
  run which kbox
  [ "$status" -eq 0 ]
}
