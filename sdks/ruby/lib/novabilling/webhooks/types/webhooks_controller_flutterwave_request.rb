# frozen_string_literal: true

module Novabilling
  module Webhooks
    module Types
      class WebhooksControllerFlutterwaveRequest < Internal::Types::Model
        field :verif_hash, -> { String }, optional: true, nullable: false, api_name: "verif-hash"
      end
    end
  end
end
