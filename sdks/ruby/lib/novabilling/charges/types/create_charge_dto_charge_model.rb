# frozen_string_literal: true

module Novabilling
  module Charges
    module Types
      module CreateChargeDtoChargeModel
        extend Novabilling::Internal::Types::Enum

        STANDARD = "STANDARD"
        GRADUATED = "GRADUATED"
        VOLUME = "VOLUME"
        PACKAGE = "PACKAGE"
        PERCENTAGE = "PERCENTAGE"
      end
    end
  end
end
