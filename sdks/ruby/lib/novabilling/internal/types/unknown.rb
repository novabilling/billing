# frozen_string_literal: true

module Novabilling
  module Internal
    module Types
      module Unknown
        include Novabilling::Internal::Types::Type

        def coerce(value)
          value
        end
      end
    end
  end
end
