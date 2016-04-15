#!/usr/bin/env bats

# just testing
@test "just do anything that fails" {
  run which asdfgh7
  [ "$status" -eq 0 ]
}
