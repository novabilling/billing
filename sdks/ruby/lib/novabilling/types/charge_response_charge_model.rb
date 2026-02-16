# frozen_string_literal: true

module Novabilling
  module Types
    module ChargeResponseChargeModel
      extend Novabilling::Internal::Types::Enum

      STANDARD = "STANDARD"
      GRADUATED = "GRADUATED"
      VOLUME = "VOLUME"
      PACKAGE = "PACKAGE"
      PERCENTAGE = "PERCENTAGE"
    end
  end
end
